import { UnionFind } from ".";

const uf = new UnionFind(6);
uf.union(0, 1); // {0,1} {2} {3} {4} {5}
uf.union(2, 3); // {0,1} {2,3} {4} {5}
uf.union(1, 3); // {0,1,2,3} {4} {5}

console.log(uf.getGroups());
