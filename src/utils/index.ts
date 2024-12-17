import type { ReplacerFn } from "@/types";
import fs from "node:fs";
import path from "node:path";

/**
 * Reads the content of a file synchronously and returns it as a string.
 *
 * @param filePath - The path to the file to be read.
 * @returns The content of the file as a string.
 */
export function loadFile(filePath: string) {
	return fs.readFileSync(filePath).toString();
}

/**
 * Generates the file path for a specific day's challenge in the Advent of Code event.
 *
 * @param year - The year of the Advent of Code event.
 * @param day - The day of the challenge within the event.
 * @returns The file path string for the specified day's challenge.
 */
export function getDayPath(year: string, day: string): string {
	return `./aoc/${year}/day${day.padStart(2, "0")}`;
}

/**
 * Downloads the input data for a specific day of Advent of Code and saves it to a file.
 *
 * @param year - The year of the Advent of Code event.
 * @param day - The day of the Advent of Code puzzle.
 * @returns A promise that resolves when the input data has been downloaded and saved.
 *
 * @throws Will throw an error if the fetch request fails or if there is an issue writing the file.
 */
export async function downloadInput(year: string, day: string) {
	try {
		const downloadPath = path.resolve(getDayPath(year, day), "input.txt");
		console.log(`Downloading input for ${year} day ${day}...`);
		const res = await fetch(`https://adventofcode.com/${year}/day/${Number(day)}/input`, {
			headers: {
				Cookie: typeof Bun !== "undefined" ? Bun.env.AOC_TOKEN : process.env.AOC_TOKEN,
			},
		});

		if (!res.ok) {
			throw new Error(
				`Fetching data ${year}-${day} failed: ${res.status} ${res.statusText}`,
			);
		}
		const text = await res.text();
		if (typeof Bun !== "undefined") {
			await Bun.write(downloadPath, text);
		} else {
			fs.writeFileSync(downloadPath, text);
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.log("Unknown problem:", error);
		}
	}
}

/**
 * Generates an array of arrays, each missing one element from the original array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The input array.
 * @returns {T[][]} An array of arrays, each with one element removed from the original array.
 */
export function dropOne<T>(arr: T[]): T[][] {
	return arr.map((_, index) => arr.filter((_, filterIndex) => filterIndex !== index));
}

/**
 * Replaces all occurrences of a specified string or regular expression in the input string with a replacement string.
 *
 * @param input - The input string in which to perform the replacements.
 * @param rule - An object containing the pattern to match (`in`) and the replacement string (`out`).
 *   - `in`: The string or regular expression to be replaced.
 *   - `out`: The string to replace the matched pattern with.
 * @returns The modified string with all replacements made.
 */
function defaultReplacer(
	input: string,
	rule: { in: string | RegExp; out: string },
): string {
	return input.replaceAll(rule.in, rule.out);
}

/**
 * Asynchronously creates a file from a template, replacing variables and applying custom replacers.
 *
 * @param {string} template - The name of the template file (without extension) located in the "./aoc/templates" directory.
 * @param {string} targetPath - The path where the generated file should be written.
 * @param {Object} [variables] - An optional object containing key-value pairs for variable replacements in the template.
 * @param {Object[]} [replacers] - An optional array of replacer objects to apply custom replacements.
 * @param {Object} replacers[].rule - The rule for the replacement, containing an `in` pattern (string or RegExp) and an `out` string.
 * @param {string | RegExp} replacers[].rule.in - The pattern to search for in the template text.
 * @param {string} replacers[].rule.out - The string to replace the pattern with.
 * @param {Function} [replacers[].fn] - An optional custom replacer function. If not provided, a default replacer function is used.
 *
 * @returns {Promise<void>} A promise that resolves when the file has been written.
 */
export async function createFromTemplate(
	template: string,
	targetPath: string,
	variables?: {
		[key: string]: string;
	},
	replacers?: {
		rule: { in: string | RegExp; out: string };
		fn?: ReplacerFn;
	}[],
): Promise<void> {
	const templateText = loadFile(
		path.resolve("./aoc/templates", `${template}.template.ts`),
	);
	if (!variables) {
		await Bun.write(targetPath, templateText);
		return;
	}

	let output = templateText;

	for (const variable of Object.entries(variables)) {
		const [k, v] = variable;
		const regex = new RegExp(`<%${k}%>`, "g");
		output = output.replaceAll(regex, v);
	}

	if (replacers) {
		for (const replacer of replacers) {
			const { rule, fn = defaultReplacer } = replacer; // Use default value here
			output = fn(output, rule);
		}
	}

	await Bun.write(targetPath, output);
	return;
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
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retrieves the current run mode of the application.
 *
 * This function checks if the `Bun` environment is defined. If it is, it returns the `MODE` from `Bun.env`.
 * Otherwise, it returns the `MODE` from `process.env`.
 *
 * @returns {string} The current run mode of the application. When run under vitest, will always return "test"
 */
export function getRunMode(): string {
	if (typeof Bun !== "undefined" && Bun.env && Bun.env.MODE) {
		return Bun.env.MODE;
	}
	return process.env.MODE;
}

export function includesObject<T extends object>(
	arr: T[],
	obj: T,
	keys: (keyof T)[] = Object.keys(obj) as (keyof T)[],
): boolean {
	return arr.some((item) => keys.every((key) => item[key] === obj[key]));
}

export function popFromSet<T>(set: Set<T>): T | undefined {
	if (set.size < 1) {
		return undefined;
	}
	const items = Array.from(set);
	const item = items[Math.floor(Math.random() * items.length)];
	set.delete(item);
	return item;
}
