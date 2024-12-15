import path from "node:path";
import type { TestData, TestMap } from "@/types";
import { getDayPath, loadFile } from "@/utils";
import { createTestMap, createTestSet } from "@/utils/test";
import { describe } from "vitest";
import solution from ".";

const year = "2015";
const day = "03";

const examples1: TestData[] = [
	{ input: ">", output: 2 },
	{ input: "^>v<", output: 4 },
	{ input: "^v^v^v^v^v", output: 2 },
];

const examples2: TestData[] = [
	{ input: "^v", output: 3 },
	{ input: "^>v<", output: 3 },
	{ input: "^v^v^v^v^v", output: 11 },
];

const testMap1 = createTestMap(examples1);
const testMap2 = createTestMap(examples2);

describe("day 03 part 1", () => {
	createTestSet(testMap1, solution, "p1");
});

describe("day 03 part 2", () => {
	createTestSet(testMap2, solution, "p2");
});
