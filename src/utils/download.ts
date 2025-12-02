import fs from "node:fs";
import path from "node:path";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import Turndown from "turndown";
import { getDayPath } from ".";

function assertSessionToken(): void {
	if (!Bun.env.AOC_SESSION) {
		console.error(
			"Error: AOC_SESSION environment variable is not set.\n" +
				"Please create a .env file with your session cookie:\n\n" +
				"  AOC_SESSION=your_session_cookie_here\n\n" +
				"You can find your session cookie in your browser's developer tools\n" +
				"after logging into adventofcode.com.",
		);
		process.exit(1);
	}
}

async function writeFile(filePath: string, content: string): Promise<void> {
	if (typeof Bun !== "undefined") {
		await Bun.write(filePath, content);
	} else {
		fs.writeFileSync(filePath, content);
	}
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
	assertSessionToken();
	try {
		const downloadPath = path.resolve(getDayPath(year, day), "input.txt");
		console.log(`Downloading input for ${year} day ${day}...`);
		const res = await fetch(
			`https://adventofcode.com/${year}/day/${Number(day)}/input`,
			{
				headers: { Cookie: `session=${Bun.env.AOC_SESSION}` },
			},
		);

		if (!res.ok) {
			throw new Error(
				`Fetching data ${year}-${day} failed: ${res.status} ${res.statusText}`,
			);
		}

		const text = await res.text();
		await writeFile(downloadPath, text);
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
	assertSessionToken();
	try {
		const downloadPath = path.resolve(getDayPath(year, day), "puzzle.md");
		const url = `https://adventofcode.com/${year}/day/${Number(day)}`;
		const res = await fetch(url, { headers: { Cookie: `session=${Bun.env.AOC_SESSION}` } });

		if (!res.ok) {
			throw new Error(
				`Fetching puzzle for ${year}-${day} failed: ${res.status} ${res.statusText}`,
			);
		}
		const doc = new JSDOM(await res.text(), { url });
		const reader = new Readability(doc.window.document);
		const td = new Turndown({ headingStyle: "atx", codeBlockStyle: "fenced" });
		td.addRule("Remove links", {
			filter: ["a"],
			replacement: (content) => content,
		});
		const html = reader.parse();

		if (html) {
			const md = td
				.turndown(html.content)
				.replace(/\\?---/g, "")
				.replace(/##\s+/g, "## ")
				.replace(/^##/g, "#");
			await writeFile(downloadPath, md);
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
