import path from "node:path";
import type { TestData, TestMap } from "@/types";
import { getDayPath, loadFile } from "@/utils";
import { createTestMap, createTestSet } from "@/utils/test";
import { describe } from "vitest";
import solution from ".";

const year = "2015";
const day = "05";
const dayPath = getDayPath(year, day);

const examples1: TestData[] = [
	{ input: "ugknbfddgicrmopn", output: 1 },
	{ input: "aaa", output: 1 },
	{ input: "jchzalrnumimnmhp", output: 0 },
	{ input: "haegwjzuvuyypxyu", output: 0 },
	{ input: "dvszwmarrgswjxmb", output: 0 },
];

const examples2: TestData[] = [
	{ input: "qjhvhtzxzqqjkmpb", output: 1 },
	{ input: "xxyxx", output: 1 },
	{ input: "uurcxstgmygtbstg", output: 0 },
	{ input: "ieodomkazucvgmuy", output: 0 },
];

const testMap1: TestMap = createTestMap(examples1);
const testMap2: TestMap = createTestMap(examples2);

describe("day 05 part 1", () => {
	createTestSet(testMap1, solution, "p1");
});

describe("day 05 part 2", () => {
	createTestSet(testMap2, solution, "p2");
});
