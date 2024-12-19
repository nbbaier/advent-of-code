import path from "node:path";
import fs from "node:fs";
import { createFromTemplate, getDayPath, loadFile, getRunMode } from "./utils";
import { downloadInput, downloadPuzzle } from "./utils/download";
import { z } from "zod";

const modeSchema = z.enum(["scaffold", "attempt", "try", "test", "read"]);
type Mode = z.infer<typeof modeSchema>;

const mode: Mode = modeSchema.parse(getRunMode());

const fallbackDate = new Date();
const day = (Bun.argv[2] || fallbackDate.getDate().toString()).padStart(2, "0");
const year = Bun.argv[3] || fallbackDate.getFullYear().toString();

const dayPath = getDayPath(year, day);

const runnerPath = path.resolve(dayPath, "index.ts");
const puzzlePath = path.resolve(dayPath, "puzzle.md");
const testPath = path.resolve(dayPath, `day${day}.test.ts`);
const samplePath = path.resolve(dayPath, "sample.txt");
const inputPath = path.resolve(dayPath, "input.txt");

if (Bun.env.DEBUG) {
	console.log("mode    =", mode);
	console.log("year    =", year);
	console.log("day     =", day);
	console.log("runner  =", runnerPath);
	console.log("sample  =", samplePath);
	console.log("input   =", inputPath);
	console.log("tests   =", testPath);
}

if (mode === "scaffold") {
	if (fs.existsSync(runnerPath)) {
		console.log(`Day exists: ${year} day ${day}`);
		process.exit();
	}
	console.log(`Scaffolding: ${year} day ${day}`);

	await createFromTemplate("runner", runnerPath);
	await createFromTemplate("tests", testPath, { day, year }, [
		{ rule: { in: "./runner.template", out: "." } },
	]);
	await downloadInput(year, day);
	await downloadPuzzle(year, day);

	process.exit();
}

if (mode === "read") {
	if (fs.existsSync(puzzlePath)) {
		console.log(`Puzzle for ${year} day ${day} already exists`);
		process.exit();
	}
	console.log(`Getting puzzle text for: ${year} day ${day}`);
	await downloadPuzzle(year, day);
	process.exit();
}

try {
	const runner = (await import(runnerPath)) as {
		default: {
			p1: (input: string) => string | number;
			p2: (input: string) => string | number;
		};
	};

	const start = performance.now();

	const input = loadFile(mode === "attempt" ? inputPath : samplePath);

	const p1 = runner.default.p1(input);
	const p2 = runner.default.p2(input);
	const end = performance.now();

	console.log({ p1, p2 });

	if (mode === "attempt") console.log(`\nTime: ${end - start}ms`);
} catch (error) {
	console.error("An error occurred:", error);
	process.exit(1);
}
