export class UnionFind {
	private parent: number[];
	private size: number[];

	constructor(n: number) {
		this.parent = Array.from({ length: n }, (_, i) => i);
		this.size = Array(n).fill(1);
	}

	find(x: number): number {
		if (this.parent[x] !== x) {
			this.parent[x] = this.find(this.parent[x]);
		}
		return this.parent[x];
	}

	union(x: number, y: number): boolean {
		const rootX = this.find(x);
		const rootY = this.find(y);

		if (rootX === rootY) return false;

		if (this.size[rootX] < this.size[rootY]) {
			this.parent[rootX] = rootY;
			this.size[rootY] += this.size[rootX];
		} else {
			this.parent[rootY] = rootX;
			this.size[rootX] += this.size[rootY];
		}

		return true;
	}

	getGroupSize = (x: number): number => this.size[this.find(x)];
	getGroupSizes = (): number[] => this.size.map((size, _) => size);
	getGroupCount = (): number => this.size.length;

	getGroupMembers(root: number): number[] {
		const members = [];
		for (let i = 0; i < this.parent.length; i++) {
			if (this.find(i) === root) {
				members.push(i);
			}
		}
		return members;
	}

	getGroups(): number[][] {
		const groups = new Map<number, number[]>();

		for (let i = 0; i < this.parent.length; i++) {
			const root = this.find(i);
			if (!groups.has(root)) {
				groups.set(root, []);
			}
			groups.get(root)!.push(i);
		}

		return Array.from(groups.values());
	}
}

const createPosition = (str: string) => {
	const arr = str.split(",").map(Number);
	return { str, obj: { x: arr[0], y: arr[1], z: arr[2] } };
};

function distance3d(
	p1: { x: number; y: number; z: number },
	p2: { x: number; y: number; z: number },
) {
	return Math.sqrt(
		(p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2 + (p2.z - p1.z) ** 2,
	);
}

function* createPairs<T>(arr: T[]): Generator<[T, T]> {
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			yield [arr[i], arr[j]];
		}
	}
}

function part1(input: string): number | string {
	const junctionBoxes = input
		.trim()
		.split("\n")
		.map((p) => createPosition(p));

	const pairs = Array.from(
		createPairs(junctionBoxes).map(([p1, p2]) => ({
			pair: [p1.str, p2.str],
			dist: distance3d(p1.obj, p2.obj),
		})),
	);

	const shortestPairs = pairs.sort((a, b) => a.dist - b.dist).slice(0, 10);

	console.log(shortestPairs);
	const uf = new UnionFind(junctionBoxes.length);
	const boxToIndex = new Map<string, number>();

	for (let i = 0; i < junctionBoxes.length; i++) {
		boxToIndex.set(junctionBoxes[i].str, i);
	}
	let groupCount = uf.getGroups().length;
	let latestPair: [string, string] = ["", ""];

	for (const pair of pairs.sort((a, b) => a.dist - b.dist)) {
		latestPair = pair.pair as [string, string];
		console.log("latest pair:", latestPair);
		const idx1 = boxToIndex.get(pair.pair[0])!;
		const idx2 = boxToIndex.get(pair.pair[1])!;
		uf.union(idx1, idx2);
		console.log("union", idx1, idx2);
		groupCount = uf.getGroups().length;
		console.log("group count:", groupCount);
		if (groupCount === 1) break;
	}
	return latestPair
		.map((p) => p.split(",")[0])
		.reduce((a, c) => a * Number(c), 1);
}

function part2(_input: string): number | string {
	return 0;
}

export default { p1: part1, p2: part2 };
