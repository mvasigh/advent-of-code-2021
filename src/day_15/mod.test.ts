import { readInputStr, format, lines, bench, exists } from "../util.ts";

function part1(cavern: number[][]): number {
  const cache: Record<string, number> = {};

  function traverse(row: number, col: number): number {
    const key = `${row},${col}`;

    if (row === cavern.length - 1 && col === cavern[0].length - 1)
      return cavern[row][col];
    if (!exists(cavern[row]?.[col])) return Infinity;
    if (cache[key]) return cache[key];

    const risk = cavern[row][col];

    cache[key] = Math.min(
      risk + traverse(row + 1, col),
      risk + traverse(row, col + 1)
    );

    return cache[key];
  }

  return traverse(0, 0) - cavern[0][0];
}

const get = (cavern: number[][], row: number, col: number): number => {
  const add =
    Math.floor(row / cavern.length) + Math.floor(col / cavern[0].length);
  const val = cavern[row % cavern.length][col % cavern[0].length];

  const result = (val + add) % 9 || 9;

  return result;
};

const key = (row: number, col: number) => `${row},${col}`;

function part2(cavern: number[][]): number {
  const visited = new Map<string, boolean>();
  const cost = new Map<string, number>();
  const h = cavern.length * 5;
  const w = cavern[0].length * 5;

  cost.set(key(0, 0), 0);
  const queue = [[0, 0, 0]];

  while (queue.length) {
    const [row, col, risk] = queue.shift() as [number, number, number];
    visited.set(key(row, col), true);

    [
      [row - 1, col],
      [row, col - 1],
      [row + 1, col],
      [row, col + 1]
    ].forEach(([r, c]) => {
      if (r < 0 || r >= h || c < 0 || c >= w) return;
      if (visited.get(key(r, c))) return;

      const newCost = risk + get(cavern, r, c);

      if (newCost < (cost.get(key(r, c)) || Infinity)) {
        queue.push([r, c, newCost]);
        cost.set(key(r, c), newCost)
      }
    })

    queue.sort((a, b) => a[2] - b[2]);
  }

  return cost.get(key(h - 1, w - 1)) || -1;
}

Deno.test("Part 1 Example", () => {
  const input = `1163751742
  1381373672
  2136511328
  3694931569
  7463417111
  1319128137
  1359912421
  3125421639
  1293138521
  2311944581`.trim();
  const cavern = lines(input).map((l) => l.trim().split("").map(Number));

  console.log(part1(cavern));
});

Deno.test("Part 2 Example", () => {
  const input = `1163751742
  1381373672
  2136511328
  3694931569
  7463417111
  1319128137
  1359912421
  3125421639
  1293138521
  2311944581`.trim();
  const cavern = lines(input).map((l) => l.trim().split("").map(Number));

  console.log(part2(cavern));
});

Deno.test("Day 15, Part 1:", async () => {
  const cavern = await readInputStr(15).then((txt) =>
    lines(txt).map((l) => l.split("").map(Number))
  );
  const [result, time] = bench(() => part1(cavern));
  console.log(format(result), `(${time} ms)`);
});

Deno.test("Day 15, Part 2:", async () => {
  const cavern = await readInputStr(15).then((txt) =>
    lines(txt).map((l) => l.split("").map(Number))
  );
  const [result, time] = bench(() => part2(cavern));
  console.log(format(result), `(${time} ms)`);
});
