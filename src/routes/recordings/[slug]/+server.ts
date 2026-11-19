import { error } from '@sveltejs/kit';
import { dev } from '$app/env';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { Readable } from 'node:stream';

// adapter-node only serves files that existed at build time, so the volume-mounted recordings are served here
const dir = join(process.cwd(), dev ? 'static/recordings' : 'build/client/recordings');

// shortcut: one byte range only, multi-range requests get the whole file, upgrade if a client needs them
function parseRange(header: string | null, size: number): [number, number] | null {
  const match = header?.match(/^bytes=(\d*)-(\d*)$/);
  if (!match || (!match[1] && !match[2])) return null;

  // "-N" means the last N bytes
  const start = match[1] ? Number(match[1]) : Math.max(size - Number(match[2]), 0);
  const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  return start <= end && start < size ? [start, end] : null;
}

export async function GET({ params, request }) {
  // An encoded %2F in the slug decodes to a path separator, so it could climb out of the folder
  if (basename(params.slug) !== params.slug) throw error(404, 'Recording not found');

  const path = join(dir, params.slug);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the slug is a plain file name, checked above
  const size = await stat(path)
    .then((s) => (s.isFile() ? s.size : null))
    .catch(() => null);
  if (size === null) throw error(404, 'Recording not found');

  const headers: Record<string, string> = {
    'accept-ranges': 'bytes',
    'cache-control': 'public, no-transform, max-age=3600',
    'content-type': path.endsWith('.mp3') ? 'audio/mpeg' : 'application/octet-stream',
  };

  const rangeHeader = request.headers.get('range');
  const range = parseRange(rangeHeader, size);
  if (rangeHeader && !range && /^bytes=\d*-\d*$/.test(rangeHeader)) {
    return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } });
  }

  const [start, end] = range ?? [0, size - 1];
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the slug is a plain file name, checked above
  const body = Readable.toWeb(createReadStream(path, { start, end })) as ReadableStream;

  if (range) headers['content-range'] = `bytes ${start}-${end}/${size}`;
  headers['content-length'] = String(end - start + 1);
  return new Response(body, { status: range ? 206 : 200, headers });
}
