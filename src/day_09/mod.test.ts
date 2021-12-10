import { readInputStr, format, exists } from "../util.ts";

function parseInput(input: string): number[][] {
  return input
    .trim()
    .split("\n")
    .map((row) => row.split("").map(Number));
}

const key = (r: number, c: number) => `${r},${c}`;

function findIslands(
  heightmap: number[][],
  each: (val: number, r: number, c: number) => void
) {
  const gt = (a: number, b: number) => !exists(a) || a > b;

  for (let r = 0; r < heightmap.length; r++) {
    for (let c = 0; c < heightmap[r].length; c++) {
      const val = heightmap[r][c];

      if (!gt(heightmap[r - 1]?.[c], val)) continue;
      if (!gt(heightmap[r + 1]?.[c], val)) continue;
      if (!gt(heightmap[r][c - 1], val)) continue;
      if (!gt(heightmap[r][c + 1], val)) continue;

      each(val, r, c);
    }
  }
}

function part1(heightmap: number[][]): number {
  let sum = 0;

  findIslands(heightmap, (v) => (sum += v + 1));
  
  return sum;
}

function part2(heightmap: number[][]): number {
  const basins: number[] = [];
  const visited: Record<string, boolean> = {};

  function traverse(r: number, c: number): number {
    if (
      !exists(heightmap[r]?.[c]) ||
      visited[key(r, c)] ||
      heightmap[r][c] >= 9
    )
      return 0;

    visited[key(r, c)] = true;

    return (
      1 +
      traverse(r + 1, c) +
      traverse(r - 1, c) +
      traverse(r, c + 1) +
      traverse(r, c - 1)
    );
  }

  findIslands(heightmap, (_, r, c) => {
    if (visited[key(r, c)]) return;
    basins.push(traverse(r, c));
  });

  return basins
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, v) => sum * v);
}

Deno.test("Day 9, Part 1:", async () => {
  const input = await readInputStr(9).then(parseInput);
  console.log(format(part1(input)));
});

Deno.test("Day 9, Part 2:", async () => {
  const input = await readInputStr(9).then(parseInput);
  console.log(format(part2(input)));
});
