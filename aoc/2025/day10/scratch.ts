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

const input: string = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

interface Machine {
	initialState: string[];
	targetState: string[];
	buttons: number[][];
	joltage: string | number[];
}

const data: Machine[] = input
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

const applyBtn = (btn: number[], initialState: string[]) => {
	const state = initialState;
	for (const i of btn) {
		state[i] = state[i] === "." ? "#" : ".";
	}
	return state;
};

let total = 0;
for (const machine of data) {
	const { buttons, targetState, initialState } = machine;
	let comboLength = 1;
	let targetReached = false;
	console.log(`b: ${buttons.length}`);
	console.log(`i: ${machine.initialState.join("")}`);
	console.log(`t: ${machine.targetState.join("")}`);
	while (!targetReached) {
		console.log("--------------------------------");
		console.log(`evaluating combo length: ${comboLength}`);
		console.log("--------------------------------");
		for (const combo of getCombinations(buttons, comboLength)) {
			let state = [...initialState];
			for (const btn of combo) {
				state = applyBtn(btn, state);
			}
			if (state.join("") === targetState.join("")) {
				targetReached = true;
			}
			console.log(
				`combo: ${JSON.stringify(combo)} | state: ${state.join("")} | targetReached: ${targetReached}`,
			);
			if (targetReached) {
				total += comboLength;
				break;
			}
		}
		console.log(`target reached: ${targetReached}`);
		comboLength++;
	}
}

console.log(total);
