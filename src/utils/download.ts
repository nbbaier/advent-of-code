import fs from "node:fs";
import path from "node:path";
import Turndown from "turndown";
import { getDayPath } from ".";

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
			throw new Error(`Fetching data ${year}-${day} failed: ${res.status} ${res.statusText}`);
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
 * Downloads the Advent of Code puzzle for the specified year and day, converts it to Markdown,
 * and saves it to a file named `puzzle.md` in the appropriate directory.
 *
 * @param year - The year of the puzzle to download.
 * @param day - The day of the puzzle to download.
 * @throws Will throw an error if the fetch request fails or if there is an issue writing the file.
 */

export async function downloadPuzzle(year: string, day: string) {
	try {
		const downloadPath = path.resolve(getDayPath(year, day), "puzzle.md");
		const res = await fetch(`https://adventofcode.com/${year}/day/${Number(day)}`, {
			headers: {
				Cookie: typeof Bun !== "undefined" ? Bun.env.AOC_TOKEN : process.env.AOC_TOKEN,
			},
		});

		if (!res.ok) {
			throw new Error(
				`Fetching puzzle for ${year}-${day} failed: ${res.status} ${res.statusText}`,
			);
		}
		const html = await res.text();
		const td = new Turndown({ headingStyle: "atx" });

		function containsChild(node: HTMLElement) {
			return Array.from(node.children).some((child) => child.matches("span.share"));
		}

		td.remove(["nav", "header", "title", "script"]);
		td.addRule("Remove stuff I don't want", {
			filter: (node) => {
				return node.id === "sidebar" || containsChild(node);
			},
			replacement: () => {
				return "";
			},
		});
		td.addRule("Format headings", {
			filter: ["h2"],
			replacement: (content) => {
				return `## ${content.replaceAll(/\\?---/g, "").trim()}`;
			},
		});
		td.addRule("Remove links", { filter: ["a"], replacement: (content) => content });

		const md = td
			.turndown(html)
			.replace("Although it hasn't changed, you can still get your puzzle input.", "")
			.trim();

		if (typeof Bun !== "undefined") {
			await Bun.write(downloadPath, md);
		} else {
			fs.writeFileSync(downloadPath, md);
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.log("Unknown problem:", error);
		}
	}
}
