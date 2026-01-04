import { addMaps, mapsAreEqual, Queue } from "@/utils/queue";

type JoltageMap = Map<number, number>;
type Machine = ReturnType<typeof createMachine>;

const input = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

function createMachine(input: string[]) {
	const btnStrs = input
		.slice(1, -1)
		.map((btn) => btn.replace(/\(|\)/g, "").split(",").map(Number) as number[]);

	const buttons = btnStrs.map((btn) => new Map(btn.map((index) => [index, 1])));

	const jStr =
		input.at(-1)?.replace("{", "").replace("}", "").split(",").map(Number) ??
		[];

	return {
		buttons,
		targetJoltages: new Map(jStr.map((j, i) => [i, j])),
		initialJoltages: new Map(jStr.map((_, i) => [i, 0])),
		targetStr: jStr.join(","),
	};
}

const machines = input
	.trim()
	.split("\n")
	.map((line) => line.split(" "))
	.map(createMachine);

function step(
	queue: Queue<{ joltages: JoltageMap; distance: number }>,
	visited: string[],
	machine: Machine,
	debug: boolean = false,
) {
	const { targetJoltages } = machine;
	const targetValues = [...targetJoltages.values()];

	if (debug) {
		console.log("------");
		console.log("initial state =", queue.getState());
		console.log("------");
	}

	// dequeue state + distance
	const next = queue.dequeue();
	if (!next) return undefined;
	const { joltages, distance } = next;

	// check if equals target, if yes, return distance
	const success = mapsAreEqual(joltages, targetJoltages);

	if (debug) {
		console.log("target reached? =", success);
		console.log("------");
	}

	if (success) return distance;

	// compute new states
	const { buttons } = machine;
	for (const btn of buttons) {
		if (debug) {
			console.log(`pressing button:`, btn);
		}
		const newJoltages = addMaps(joltages, btn);
		if (debug) {
			console.log("new state: ", newJoltages);
		}
		const newJoltagesStr = [...newJoltages.values()].join(",");

		const isVisited = visited.includes(newJoltagesStr);
		if (debug) {
			console.log("not in visited =", !isVisited);
		}

		const notExceeds = [...newJoltages.values()]
			.map((j, i) => {
				return j <= targetValues[i];
			})
			.every((t) => t);
		if (debug) {
			console.log("doesn't exceed =", notExceeds);
			console.log("add to queue =", !isVisited && notExceeds);
		}

		if (!isVisited && notExceeds) {
			queue.enqueue({ joltages: newJoltages, distance: distance + 1 });
			visited.push(newJoltagesStr);
		}
		if (debug) {
			console.log("visited =", visited);
		}
	}
}

const machine = machines[0];

const queue = new Queue<{ joltages: JoltageMap; distance: number }>({
	initialState: [{ joltages: machine.initialJoltages, distance: 0 }],
});
const visited = [[...machine.initialJoltages.values()].join(",")];

let stop = false;
let stepCount = 1;
while (!stop) {
	console.log(`step ${stepCount}:`, queue.size());
	const result = step(queue, visited, machine);
	if (result === undefined) {
		console.log("no result");
		stepCount++;
	} else {
		console.log("result:", result);
		stop = true;
	}
}
