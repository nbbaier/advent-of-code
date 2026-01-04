import { addMaps, mapsAreEqual, Queue } from "@/utils/queue";

type JoltageMap = Map<number, number>;
type Machine = ReturnType<typeof createMachine>;

const applyBtn = (btn: number[], initialState: string[]) => {
	const state = initialState;
	for (const i of btn) {
		state[i] = state[i] === "." ? "#" : ".";
	}
	return state;
};

function createMachine(input: string[]) {
	const buttonArray = input
		.slice(1, -1)
		.map((btn) => btn.replace(/\(|\)/g, "").split(",").map(Number) as number[]);

	const buttons = buttonArray.map(
		(btn) => new Map(btn.map((index) => [index, 1])),
	);

	const jStr =
		input.at(-1)?.replace("{", "").replace("}", "").split(",").map(Number) ??
		[];

	const targetLightsStr = input[0].replace(/\[|\]/g, "");
	return {
		buttons,
		buttonArray,
		initialLights: targetLightsStr.replaceAll("#", ".").split(""),
		targetLights: targetLightsStr.split(""),
		targetJoltages: new Map(jStr.map((j, i) => [i, j])),
		initialJoltages: new Map(jStr.map((_, i) => [i, 0])),
		targetStr: jStr.join(","),
	};
}

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
		.map((line) => line.split(" "))
		.map(createMachine);

	let total = 0;

	for (const machine of machines) {
		const { buttonArray: buttons, targetLights, initialLights } = machine;
		let comboLength = 1;
		let targetReached = false;
		while (!targetReached) {
			for (const combo of getCombinations(buttons, comboLength)) {
				let state = [...initialLights];
				for (const btn of combo) {
					state = applyBtn(btn, state);
				}
				if (state.join("") === targetLights.join("")) targetReached = true;

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

function part2(input: string): number | string {
	const machines: Machine[] = input
		.trim()
		.split("\n")
		.map((line) => line.split(" "))
		.map(createMachine);

	function step(
		queue: Queue<{ joltages: JoltageMap; distance: number }>,
		visited: Set<string>,
		machine: Machine,
		stats: { statesExplored: number; maxQueueSize: number },
	) {
		const { targetJoltages } = machine;
		const targetValues = [...targetJoltages.values()];

		const next = queue.dequeue();
		if (!next) return undefined;

		stats.statesExplored++;
		stats.maxQueueSize = Math.max(stats.maxQueueSize, queue.size());

		const { joltages, distance } = next;

		const success = mapsAreEqual(joltages, targetJoltages);

		if (success) return distance;

		const { buttons } = machine;
		for (const btn of buttons) {
			const newJoltages = addMaps(joltages, btn);
			const newJoltagesStr = [...newJoltages.values()].join(",");

			if (!visited.has(newJoltagesStr)) {
				const notExceeds = [...newJoltages.values()].every(
					(j, i) => j <= targetValues[i],
				);

				if (notExceeds) {
					queue.enqueue({ joltages: newJoltages, distance: distance + 1 });
					visited.add(newJoltagesStr);
				}
			}
		}
	}
	let total = 0;
	//
	// const thing = [...machines.entries()].slice(0, 4);

	for (const [idx, machine] of [...machines.entries()].slice(0, 1)) {
		const startTime = performance.now();
		const stats = { statesExplored: 0, maxQueueSize: 0 };

		const queue = new Queue<{ joltages: JoltageMap; distance: number }>({
			initialState: [{ joltages: machine.initialJoltages, distance: 0 }],
		});
		const visited = new Set<string>([
			[...machine.initialJoltages.values()].join(","),
		]);

		let stop = false;
		while (!stop) {
			const result = step(queue, visited, machine, stats);
			if (result !== undefined) {
				const elapsed = performance.now() - startTime;
				console.log(
					`Machine ${idx}: ${result} presses, ${stats.statesExplored} states, max queue ${stats.maxQueueSize}, ${elapsed.toFixed(2)}ms`,
				);
				total += result;
				stop = true;
			}
		}
	}

	return total;
}

export default { p1: part1, p2: part2 };
