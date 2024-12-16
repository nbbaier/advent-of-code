import { test, expect } from "vitest";
import type { TestData, TestMap } from "../types";

/**
 * Creates a map of test data from an array of examples.
 *
 * @param examples - An array of test data objects.
 * @returns A map where each key is either the name of the test data object or a string
 *          representation of its input and output, and each value is the corresponding test data object.
 */
export function createTestMap(examples: TestData[]): TestMap {
	const testMap: TestMap = new Map();

	for (const obj of examples) {
		const testKey = obj.name ? obj.name : `${obj.input} = ${obj.output}`;
		testMap.set(testKey, obj);
	}

	return testMap;
}

/**
 * Runs a set of tests based on the provided test map and solution functions.
 *
 * @param testMap - A map where the keys are test names and the values are test data containing input and expected output.
 * @param solution - An object containing two solution functions, one for part 1 (`p1`) and one for part 2 (`p2`).
 * @param part - Specifies which part of the solution to test, either "p1" or "p2".
 */
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
