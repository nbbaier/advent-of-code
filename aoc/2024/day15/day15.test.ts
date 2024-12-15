import path from "node:path";
import type { TestData, TestMap } from "@/types";
import { getDayPath, loadFile } from "@/utils";
import { createTestMap, createTestSet } from "@/utils/test";
import { describe } from "vitest";
import solution from ".";

const year = "2024";
const day = "15";
const dayPath = getDayPath(year, day);

const examples1: TestData[] = [
	{
		name: "small sample => 2028",
		input: loadFile(path.resolve(dayPath, "sample-small.txt")),
		output: 2028,
	},
	{
		name: "sample => 10092",
		input: loadFile(path.resolve(dayPath, "sample.txt")),
		output: 10092,
	},
];
const examples2: TestData[] = [{ input: "", output: 0 }];

const testMap1: TestMap = createTestMap(examples1);
const testMap2: TestMap = createTestMap(examples2);

describe("day 15 part 1", () => {
	createTestSet(testMap1, solution, "p1");
});

describe("day 15 part 2", () => {
	createTestSet(testMap2, solution, "p2");
});
