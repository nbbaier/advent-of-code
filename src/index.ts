import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { createFromTemplate, getDayPath, getRunMode, loadFile } from "./utils";
import { downloadInput, downloadPuzzle } from "./utils/download";

function showHelp() {
	console.log(`
Advent of Code CLI

Usage:
  bun run <command> [day] [year]

Commands:
  scaffold  Set up a new day (creates files, downloads input and puzzle)
  try       Run solution against sample.txt
  attempt   Run solution against input.txt (with timing)
  read      Download puzzle description to puzzle.md
  refresh   Re-download puzzle (useful after solving part 1)
  check     Run all tests (supports: bun run check -- aoc/2024/day01)
  watch     Run tests in watch mode

Options:
  --force   Force re-download even if files exist (for scaffold, read)

Arguments:
  day       Day number (1-25), defaults to current day
  year      Year (e.g., 2024), defaults to current year

Examples:
  bun run scaffold 1 2024    # Set up day 1 of 2024
  bun run try 5              # Test day 5 of current year with sample data
  bun run attempt 12 2023    # Run day 12 of 2023 with real input
  bun run refresh 5          # Re-download puzzle after solving part 1

Environment:
  AOC_SESSION  Your adventofcode.com session cookie (required for downloads)
`);
	process.exit(0);
}

if (Bun.argv.includes("--help") || Bun.argv.includes("-h")) {
	showHelp();
}

const forceFlag = Bun.argv.includes("--force") || Bun.argv.includes("-f");
const filteredArgs = Bun.argv.filter((arg) => !arg.startsWith("-"));

const modeSchema = z.enum(["scaffold", "attempt", "try", "test", "read", "refresh"]);
type Mode = z.infer<typeof modeSchema>;

const mode: Mode = modeSchema.parse(getRunMode());

const fallbackDate = new Date();
const day = (filteredArgs[2] || fallbackDate.getDate().toString()).padStart(2, "0");
const year = filteredArgs[3] || fallbackDate.getFullYear().toString();

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
	if (fs.existsSync(runnerPath) && !forceFlag) {
		console.log(`Day exists: ${year} day ${day} (use --force to re-scaffold)`);
		process.exit();
	}
	console.log(`Scaffolding: ${year} day ${day}`);

	await createFromTemplate("runner", runnerPath);
	await createFromTemplate("tests", testPath, { day, year }, [
		{ rule: { in: "./runner.template", out: "." } },
	]);
	await Bun.write(samplePath, "");
	await downloadInput(year, day);
	await downloadPuzzle(year, day);

	process.exit();
}

if (mode === "read") {
	if (fs.existsSync(puzzlePath) && !forceFlag) {
		console.log(`Puzzle for ${year} day ${day} already exists (use --force to re-download)`);
		process.exit();
	}
	console.log(`Getting puzzle text for: ${year} day ${day}`);
	await downloadPuzzle(year, day);
	process.exit();
}

if (mode === "refresh") {
	console.log(`Refreshing puzzle for: ${year} day ${day}`);
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
