import { Graph } from "@dagrejs/graphlib";

const input = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

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

for (const path of findAllPaths(g, "svr", "out")) {
	console.log(JSON.stringify(path));
}
