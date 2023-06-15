type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'et') {
	const formatter = new Intl.DateTimeFormat(locales, { dateStyle });

	return formatter.format(new Date(date));
}

export const throttle = (func: { (e: MouseEvent): void; apply?: any }, duration: number) => {
	let shouldWait = false;

	return (...args: any[]) => {
		if (!shouldWait) {
			func.apply(args);

			shouldWait = true;

			setTimeout(function () {
				shouldWait = false;
			}, duration);
		}
	};
};

export const angleToMouse = (cx: number, cy: number, ex: number, ey: number) => {
	const dy = ey - cy;
	const dx = ex - cx;
	const rad = Math.atan2(dy, dx); // (-Pie, Pie]
	const deg = (rad * 180) / Math.PI; // rads to degs, (-180, 180]
	return deg;
};

export const trimString = (str: string, len: number) =>
	str.length > len ? str.substring(0, len - 3) + '...' : str.substring(0, len);
