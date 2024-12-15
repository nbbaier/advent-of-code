import path from "node:path";
import type { TestData, TestMap } from "@/types";
import { getDayPath, loadFile } from "@/utils";
import { createTestMap, createTestSet } from "@/utils/test";
import { describe } from "vitest";
import solution from ".";

const year = "2024";
const day = "05";
const dayPath = getDayPath(year, day);

// const examples1: TestData[] = [{ input: "", output: 0 }];
const examples1: TestData[] = [
	{
		name: "sample => 143",
		input: loadFile(path.resolve(dayPath, "sample.txt")),
		output: 143,
	},
];
const examples2: TestData[] = [
	{
		name: "sample => 123",
		input: loadFile(path.resolve(dayPath, "sample.txt")),
		output: 123,
	},
];

const testMap1: TestMap = createTestMap(examples1);
const testMap2: TestMap = createTestMap(examples2);

describe("day 05 part 1", () => {
	createTestSet(testMap1, solution, "p1");
});

describe("day 05 part 2", () => {
	createTestSet(testMap2, solution, "p2");
});
