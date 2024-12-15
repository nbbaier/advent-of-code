import { test, expect } from "vitest";
import type { TestData, TestMap } from "../types";

export function createTestMap(examples: TestData[]): TestMap {
	const testMap: TestMap = new Map();

	for (const obj of examples) {
		const testKey = obj.name ? obj.name : `${obj.input} = ${obj.output}`;
		testMap.set(testKey, obj);
	}

	return testMap;
}

export function createTestSet(
	testMap: TestMap,
	solution: {
		p1: (input: string) => string | number;
		p2: (input: string) => string | number;
	},
	part: "p1" | "p2",
) {
	return test.each([...testMap.keys()])("%s", (key) => {
		const { input, output } = testMap.get(key) as TestData;
		expect(solution[part](input)).toEqual(output);
	});
}
