import path from "node:path";
import type { TestData, TestMap } from "@/types";
import { getDayPath, loadFile } from "@/utils";
import { createTestMap, createTestSet } from "@/utils/test";
import { describe } from "vitest";
import solution from "./runner.template";

const year = "<%year%>";
const day = "<%day%>";
const dayPath = getDayPath(year, day);

const examples1: TestData[] = [{ input: "", output: 0 }];
const examples2: TestData[] = [{ input: "", output: 0 }];
const examples3: TestData[] = [
	{
		name: "named test",
		input: loadFile(path.resolve(dayPath, "sample.txt")),
		output: 0,
	},
];

const testMap1: TestMap = createTestMap(examples1);
const testMap2: TestMap = createTestMap(examples2);

describe("day <%day%> part 1", () => {
	createTestSet(testMap1, solution, "p1");
});

describe("day <%day%> part 2", () => {
	createTestSet(testMap2, solution, "p2");
});
