type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'et') {
	const formatter = new Intl.DateTimeFormat(locales, { dateStyle });

	return formatter.format(new Date(date));
}

export function throttle(func, duration) {
	let shouldWait = false;

	return function (...args) {
		if (!shouldWait) {
			func.apply(this, args);
			shouldWait = true;

			setTimeout(function () {
				shouldWait = false;
			}, duration);
		}
	};
}

export const trimString = (str: string, len: number) =>
	str.length > len ? str.substring(0, len - 3) + '...' : str.substring(0, len);
