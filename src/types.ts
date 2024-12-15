export interface TestData {
	name?: string;
	input: string;
	output: string | number;
}

export type TestMap = Map<string, TestData>;

export type Point = {
	x: number;
	y: number;
};

export type Direction = {
	dx: number;
	dy: number;
};

export type DirLabel = "r" | "l" | "d" | "u" | "ur" | "dl" | "dr" | "ul";
export type DirectionSet = {
	[K in DirLabel]?: Direction;
};

export type ReplacerFn = (input: string, rule: { in: string | RegExp; out: string }) => string;
