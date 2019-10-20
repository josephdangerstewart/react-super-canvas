export default function fillDefaults<T>(obj: T, defaults: object): T {
	return {
		...defaults,
		...obj,
	} as T;
}
