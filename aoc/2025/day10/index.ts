interface Machine {
	initialState: string[];
	targetState: string[];
	buttons: number[][];
	joltage: string | number[];
}

const applyBtn = (btn: number[], initialState: string[]) => {
	const state = initialState;
	for (const i of btn) {
		state[i] = state[i] === "." ? "#" : ".";
	}
	return state;
};

function getCombinations<T>(array: T[], n: number): T[][] {
	const result: T[][] = [];

	if (n === 0) return [[]];
	if (n > array.length) return [];
	if (n === array.length) return [array];

	function backtrack(start: number, current: T[]): void {
		if (current.length === n) {
			result.push([...current]);
			return;
		}

		for (let i = start; i <= array.length - (n - current.length); i++) {
			current.push(array[i]);
			backtrack(i + 1, current);
			current.pop();
		}
	}

	backtrack(0, []);
	return result;
}

function part1(input: string): number | string {
	const machines: Machine[] = input
		.trim()
		.split("\n")
		.map((l) => l.split(" "))
		.map((l) => ({
			initialState: new Array(l[0].length - 2).fill(".") as string[],
			targetState: l[0].split("").slice(1, -1) as string[],
			buttons: l
				.slice(1, -1)
				.map((btn) =>
					btn.replace(/\(|\)/g, "").split(",").map(Number),
				) as number[][],
			joltage: l.at(-1) as string,
		}));

	let total = 0;

	for (const machine of machines) {
		const { buttons, targetState, initialState } = machine;
		let comboLength = 1;
		let targetReached = false;
		while (!targetReached) {
			for (const combo of getCombinations(buttons, comboLength)) {
				let state = [...initialState];
				for (const btn of combo) {
					state = applyBtn(btn, state);
				}
				if (state.join("") === targetState.join("")) targetReached = true;

				if (targetReached) {
					total += comboLength;
					break;
				}
			}
			comboLength++;
		}
	}
	return total;
}

function part2(_input: string): number | string {
	return 0;
}

export default { p1: part1, p2: part2 };
