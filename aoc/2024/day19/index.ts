import { getRunMode } from "@/utils";

const runMode = getRunMode();

function parse(input: string) {
	const [patterns, _, ...designs] = input.trim().split("\n");
	return [patterns.split(","), designs.map((d) => d.trim())];
}

function isValidDesign(design: string, patterns: string[]): boolean {
	if (design.length === 0) {
		return true;
	}
	for (const pattern of patterns) {
		if (design.startsWith(pattern)) {
			const remainder = design.slice(pattern.length);
			if (isValidDesign(remainder, patterns)) return true;
		}
	}
	return false;
}

function part1(input: string): number | string {
	const [patterns, designs] = parse(input);

	let valid = 0;
	for (const design of designs) {
		valid += isValidDesign(design, patterns) ? 1 : 0;
	}

	return valid;
}

function part2(input: string): number | string {
	return 0;
}

export default { p1: part1, p2: part2 };
