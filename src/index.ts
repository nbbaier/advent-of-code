import path from "node:path";
import fs from "node:fs";
import { createFromTemplate, downloadInput, getDayPath, loadFile } from "./utils";
import { z } from "zod";

const modeSchema = z.enum(["scaffold", "attempt", "try"]);
type Mode = z.infer<typeof modeSchema>;

const fallbackDate = new Date();

const mode = modeSchema.parse(Bun.argv[2]);
const day = (Bun.argv[3] || fallbackDate.getDate().toString()).padStart(2, "0");
const year = Bun.argv[4] || fallbackDate.getFullYear().toString();

const dayPath = getDayPath(year, day);

const runnerPath = path.resolve(dayPath, "index.ts");
const testPath = path.resolve(dayPath, `day${day}.test.ts`);
const samplePath = path.resolve(dayPath, "sample.txt");
const inputPath = path.resolve(dayPath, "input.txt");

// console.log("mode     =", mode);
// console.log("year     =", year);
// console.log("day      =", day);
// console.log("runner   =", runnerPath);
// console.log("sample    =", samplePath);
// console.log("input    =", inputPath);
// console.log("tests    =", testPath);

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
