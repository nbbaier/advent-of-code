/**
 * Generates an array of arrays, each missing one element from the original array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The input array.
 * @returns {T[][]} An array of arrays, each with one element removed from the original array.
 */
export function dropOne<T>(arr: T[]): T[][] {
	return arr.map((_, index) =>
		arr.filter((_, filterIndex) => filterIndex !== index),
	);
}

/**
 * Returns the middle index of an array. If the array is empty, returns null.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to find the middle index of.
 * @returns {number | null} The middle index of the array, or null if the array is empty.
 */
export function getMiddleIndex<T>(arr: T[]): number | null {
	if (arr.length === 0) {
		return null;
	}
	return Math.floor(arr.length / 2);
}

/**
 * Delays the execution of code for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Checks if an array contains an object matching specific keys.
 *
 * @template T - The type of objects in the array.
 * @param arr - The array to search.
 * @param obj - The object to find.
 * @param keys - The keys to compare (defaults to all keys of obj).
 * @returns True if a matching object is found.
 */
export function includesObject<T extends object>(
	arr: T[],
	obj: T,
	keys: (keyof T)[] = Object.keys(obj) as (keyof T)[],
): boolean {
	return arr.some((item) => keys.every((key) => item[key] === obj[key]));
}

/**
 * Removes and returns a random element from a Set.
 *
 * @template T - The type of elements in the set.
 * @param set - The set to pop from.
 * @returns The removed element, or undefined if the set is empty.
 */
export function popFromSet<T>(set: Set<T>): T | undefined {
	if (set.size < 1) {
		return undefined;
	}
	const items = Array.from(set);
	const item = items[Math.floor(Math.random() * items.length)];
	set.delete(item);
	return item;
}
