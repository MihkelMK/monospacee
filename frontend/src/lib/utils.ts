type DateStyle = Intl.DateTimeFormatOptions["dateStyle"];

export function formatDate(
  date: string,
  dateStyle: DateStyle = "medium",
  locales = "et",
) {
  const formatter = new Intl.DateTimeFormat(locales, { dateStyle });
  return formatter.format(new Date(date));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = (func: (e: any) => void, limit: number) => {
  let inThrottle: boolean | NodeJS.Timeout;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (e: any) => {
    if (!inThrottle) {
      func(e);
      inThrottle = setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const angleToMouse = (
  cx: number,
  cy: number,
  ex: number,
  ey: number,
) => {
  const dy = ey - cy;
  const dx = ex - cx;
  const rad = Math.atan2(dy, dx); // (-Pie, Pie]
  const deg = (rad * 180) / Math.PI; // rads to degs, (-180, 180]
  return deg;
};

export const trimString = (str: string, len: number) =>
  str.length > len ? str.substring(0, len - 3) + "…" : str.substring(0, len);

export const timeStringFromSeconds = (seconds: number) => {
  const hour = Math.floor(seconds / 60 / 60);
  const allMin = Math.floor(seconds / 60);
  const minInThisHour = allMin - hour * 60;
  const sec = Math.floor(seconds - allMin * 60);

  return `${String(hour).padStart(2, "0")}:${
    String(minInThisHour).padStart(2, "0")
  }:${
    String(
      sec,
    ).padStart(2, "0")
  }`;
};

export function keybind(
  _element: never,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: { binds: string[]; on_bind: any },
) {
  // Now we're also expecting `{binds: string[]}` as a provided
  // option. Which will contain a set of bound keys like `["Control", "h"]`
  let { binds, on_bind } = options;

  // Here, we're creating a `Map<string, boolean>` which contains the keys we need to
  // listen for with boolean flags. However we need to convert them into
  // `[string, boolean]` pairs so `Map` knows how to create the associations.
  let lookup = new Map(binds.map((key: string) => [key, false]));

  function on_key_down(event: { repeat: boolean; key: string; preventDefault: () => void; }) {
    if (event.repeat) return;

    // With our dynamic lookup, we've greatly simplified from a switch-case.
    if (lookup.has(event.key)) {
      event.preventDefault();

      lookup.set(event.key, true);
    }

    // But we've traded that earlier complexity for needing to loop all of
    // our bound key flags.
    for (const [_key, flag] of lookup) {
      // If any flag is `false`, we just early return to skip.
      if (!flag) return;
    }

    on_bind();
  }

  function on_key_up(event: { key: string; }) {
    // Here, just like `on_key_down`, we do the same but flagging `false`.
    if (lookup.has(event.key)) {
      lookup.set(event.key, false);
    }
  }

  globalThis.addEventListener("keydown", on_key_down);
  globalThis.addEventListener("keyup", on_key_up);

  return {
    destroy() {
      globalThis.removeEventListener("keydown", on_key_down);
      globalThis.removeEventListener("keyup", on_key_up);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // deno-lint-ignore no-explicit-any
    update(options: { binds: string[]; on_bind: any }) {
      // Since we're supporting reactive options, we need to reinitialize
      // a new lookup `Map` with the new keys and to dump the old state.
      ({ binds, on_bind } = options);

      lookup = new Map(binds.map((key: string) => [key, false]));
    },
  };
}
