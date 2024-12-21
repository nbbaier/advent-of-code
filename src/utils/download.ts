import fs from "node:fs";
import path from "node:path";
import Turndown from "turndown";
import { getDayPath } from ".";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

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
			headers: { Cookie: Bun.env.AOC_TOKEN },
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
 * Downloads the puzzle for a given year and day from the Advent of Code website and saves it as a markdown file.
 *
 * @param year - The year of the puzzle to download.
 * @param day - The day of the puzzle to download.
 * @throws Will throw an error if the fetch request fails or if the puzzle HTML cannot be parsed.
 */
export async function downloadPuzzle(year: string, day: string) {
	try {
		const downloadPath = path.resolve(getDayPath(year, day), "puzzle.md");
		const url = `https://adventofcode.com/${year}/day/${Number(day)}`;
		const res = await fetch(url, { headers: { Cookie: Bun.env.AOC_TOKEN } });

		if (!res.ok) {
			throw new Error(
				`Fetching puzzle for ${year}-${day} failed: ${res.status} ${res.statusText}`,
			);
		}
		const doc = new JSDOM(await res.text(), { url });
		const reader = new Readability(doc.window.document);
		const td = new Turndown({ headingStyle: "atx", codeBlockStyle: "fenced" });
		td.addRule("Remove links", { filter: ["a"], replacement: (content) => content });
		const html = reader.parse();

		if (html) {
			const md = td
				.turndown(html.content)
				.replace(/\\?---/g, "")
				.replace(/##\s+/g, "## ")
				.replace(/^##/g, "#");
			if (typeof Bun !== "undefined") {
				await Bun.write(downloadPath, md);
			} else {
				fs.writeFileSync(downloadPath, md);
			}
		} else {
			throw new Error("Failed to parse puzzle html.");
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.log("Unknown problem:", error);
		}
	}
}
