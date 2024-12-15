import type { ReplacerFn } from "@/types";
import fs from "node:fs";
import path from "node:path";

export function loadFile(filePath: string) {
	return fs.readFileSync(filePath).toString();
}

export function getDayPath(year: string, day: string): string {
	return `./aoc/${year}/day${day.padStart(2, "0")}`;
}

export async function downloadInput(year: string, day: string) {
	try {
		const downloadPath = path.resolve(getDayPath(year, day), "input.txt");
		console.log(`Downloading input for ${year} day ${day}...`);
		const res = await fetch(`https://adventofcode.com/${year}/day/${Number(day)}/input`, {
			headers: {
				Cookie: Bun.env.AOC_TOKEN,
			},
		});

		if (!res.ok) {
			throw new Error(`Fetching data ${year}-${day} failed: ${res.status} ${res.statusText}`);
		}
		const text = await res.text();
		await Bun.write(downloadPath, text);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.log("Unknown problem:", error);
		}
	}
}

const defaultReplacer: ReplacerFn = (
	input: string,
	rule: { in: string | RegExp; out: string },
) => {
	return input.replaceAll(rule.in, rule.out);
};

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
) {
	const templateText = loadFile(path.resolve("./aoc/templates", `${template}.template.ts`));
	if (!variables) {
		return await Bun.write(targetPath, templateText);
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

	return await Bun.write(targetPath, output);
}
