export interface TestData {
	name?: string;
	input: string;
	output: string | number;
}

export type TestMap = Map<string, TestData>;
