import { getMiddleIndex } from "@/utils";
import toposort from "toposort";

function validateUpdate(update: string[], rules: string[]) {
	const ruleResults = [];

	for (const rule of rules) {
		const res = checkOrder(update, rule);
		ruleResults.push(res);
	}
	return ruleResults.filter((r) => r !== null).every(Boolean);
}

function parse(data: string) {
	const contents = data.trim().split("\n\n");
	const rules = contents[0].split("\n");
	const updates = contents[1].split("\n").map((update) => update.split(","));
	return { rules, updates };
}

function checkOrder(arr: string[], rule: string) {
	const [first, second] = rule.split("|");
	if (!arr.includes(first) || !arr.includes(second)) {
		return null;
	}
	return arr.indexOf(first) < arr.indexOf(second);
}

function part1(input: string): number | string {
	const { rules, updates } = parse(input);

	return updates
		.filter((update) => {
			return validateUpdate(update, rules);
		})
		.map((update) => {
			const i = getMiddleIndex(update) as number;
			return update[i];
		})
		.reduce((acc, curr) => {
			return acc + (curr !== null ? Number.parseInt(curr) : 0);
		}, 0);
}

function part2(input: string): number | string {
	const { rules, updates } = parse(input);

	// get the rulesets for incorrectly ordered updates
	const incorrect = updates
		.filter((update) => !validateUpdate(update, rules))
		.map((update) => {
			return rules.filter((rule) => {
				const [first, second] = rule.split("|");
				return update.includes(first) && update.includes(second);
			});
		});

	// get the corrected updates by using toposort
	const corrected = incorrect
		.map((update) => {
			// create a graph from the update rulesets
			const graph: [string, string][] = update.map((rule) => {
				const [from, to] = rule.split("|");
				return [from, to];
			});

			return graph;
		})
		.map((graph) => toposort(graph));

	return corrected
		.map((update) => {
			const i = getMiddleIndex(update) as number;
			return update[i];
		})
		.reduce((acc, curr) => {
			return acc + (curr !== null ? Number.parseInt(curr) : 0);
		}, 0);
}

export default { p1: part1, p2: part2 };
