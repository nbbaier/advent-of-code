type Problem = {
	input: number[];
	output: number;
};

function evalExpr(input: number[], opSet: string[]): number {
	let res = input[0];

	for (let i = 0; i < opSet.length; i++) {
		const op = opSet[i];
		if (op === "+") {
			res = res + input[i + 1];
		} else if (op === "||") {
			res = Number(`${res}${input[i + 1]}`);
		} else {
			res = res * input[i + 1];
		}
	}

	return res;
}

function parse(input: string): Problem[] {
	return input
		.trim()
		.split("\n")
		.map((line) => {
			const [output, input] = line.split(":");
			return {
				input: input.trim().split(" ").map(Number),
				output: Number(output),
			};
		});
}

function generateOpSets(n: number) {
	const operators: number = n - 1;
	const totalCombinations: number = 2 ** operators;

	const combinations: string[][] = [];
	for (let i = 0; i < totalCombinations; i++) {
		const binary = i.toString(2).padStart(operators, "0");
		const opCombination = binary.split("").map((bit) => (bit === "0" ? "*" : "+"));
		combinations.push(opCombination);
	}

	return combinations;
}

function generateTernaryOpSets(n: number) {
	const operators: number = n - 1;
	const totalCombinations: number = 3 ** operators;

	const combinations: string[][] = [];
	for (let i = 0; i < totalCombinations; i++) {
		const ternary = i.toString(3).padStart(operators, "0");
		const opCombination = ternary.split("").map((digit) => {
			switch (digit) {
				case "0":
					return "*";
				case "1":
					return "+";
				case "2":
					return "||";
				default:
					throw new Error("Invalid operator");
			}
		});
		combinations.push(opCombination);
	}

	return combinations;
}

function part1(input: string) {
	const problems = parse(input);

	const safe: Problem[] = [];
	for (const problem of problems) {
		const { input, output } = problem;
		const opSets = generateOpSets(input.length);
		for (const opSet of opSets) {
			if (evalExpr(input, opSet) === output) {
				safe.push(problem);
				break;
			}
		}
	}

	return safe.reduce((acc, { output }) => acc + output, 0);
}

function part2(input: string) {
	const problems = parse(input);

	const safe: Problem[] = [];
	for (const problem of problems) {
		const { input, output } = problem;
		const opSets = generateTernaryOpSets(input.length);
		for (const opSet of opSets) {
			if (evalExpr(input, opSet) === output) {
				safe.push(problem);
				break;
			}
		}
	}

	return safe.reduce((acc, { output }) => acc + output, 0);
}
export default { p1: part1, p2: part2 };
