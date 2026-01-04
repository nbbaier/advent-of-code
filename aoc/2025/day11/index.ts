import { Graph } from "@dagrejs/graphlib";

function findAllPaths(graph: Graph, start: string, end: string): string[][] {
	const paths: string[][] = [];
	const visited = new Set<string>();

	function dfs(current: string, path: string[]) {
		if (current === end) {
			paths.push([...path, current]);
			return;
		}

		visited.add(current);
		path.push(current);

		const successors = graph.successors(current) || [];
		for (const next of successors) {
			if (!visited.has(next)) {
				dfs(next, path);
			}
		}

		path.pop();
		visited.delete(current);
	}

	dfs(start, []);
	return paths;
}

function countPathsWithRequired(
	graph: Graph,
	start: string,
	end: string,
	required: Set<string>,
): number {
	const memo = new Map<string, number>();
	const requiredKey = (visited: Set<string>) =>
		[...required]
			.filter((r) => visited.has(r))
			.sort()
			.join(",");

	function dfs(current: string, visited: Set<string>): number {
		if (current === end) {
			// Check if all required nodes were visited
			return [...required].every((r) => visited.has(r)) ? 1 : 0;
		}

		const key = `${current}:${requiredKey(visited)}`;
		if (memo.has(key)) {
			return memo.get(key)!;
		}

		let count = 0;
		const newVisited = new Set(visited);
		newVisited.add(current);

		const successors = graph.successors(current) || [];
		for (const next of successors) {
			if (!visited.has(next)) {
				count += dfs(next, newVisited);
			}
		}

		memo.set(key, count);
		return count;
	}

	return dfs(start, new Set());
}

function part1(input: string): number | string {
	const data = input
		.trim()
		.split("\n")
		.map((l) => {
			const [node, edges] = l.split(":");
			return { node, edges: edges.trim().split(" ") };
		});

	const g = new Graph({ directed: true });

	for (const { node, edges } of data) {
		for (const edge of edges) {
			g.setEdge(node, edge);
		}
	}

	return findAllPaths(g, "you", "out").length;
}

function part2(input: string): number | string {
	const data = input
		.trim()
		.split("\n")
		.map((l) => {
			const [node, edges] = l.split(":");
			return { node, edges: edges.trim().split(" ") };
		});

	const g = new Graph({ directed: true });

	for (const { node, edges } of data) {
		for (const edge of edges) {
			g.setEdge(node, edge);
		}
	}

	return countPathsWithRequired(g, "svr", "out", new Set(["dac", "fft"]));
}

export default { p1: part1, p2: part2 };
