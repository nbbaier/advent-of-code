import fs from "node:fs";
import path from "node:path";
import type { ReplacerFn } from "@/types";

export * from "./solutions";

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
			const { rule, fn = defaultReplacer } = replacer;
			output = fn(output, rule);
		}
	}

	await Bun.write(targetPath, output);
	return;
}

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
