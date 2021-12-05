import * as util from "../util.ts";

async function readInput(): Promise<string> {
  const txt = await Deno.readTextFile("src/day_05/input.txt");
  return txt.trim();
}

function parseInput(input: string): number[][] {
  return input
    .split("\n")
    .map((line) => [...line.matchAll(/\d+/g)].map((m) => parseInt(m[0], 10)));
}

function overlaps(lines: number[][], diagonals = false): number {
  const pts: { [key: string]: number } = {};

  for (const line of lines) {
    const [x1, y1, x2, y2] = line;

    if (!diagonals && (y2 !== y1 && x2 !== x1)) continue;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const end = Math.max(Math.abs(dx), Math.abs(dy));

    for (let i = 0; i <= end; i++) {
      const x = x1 + Math.round((i / end) * dx);
      const y = y1 + Math.round((i / end) * dy);
      const key = `${x},${y}`;

      pts[key] ??= 0;
      pts[key] += 1;
    }
  }

  return Object.values(pts).filter((v) => v > 1).length;
}

function part1(lines: number[][]): number {
  return overlaps(lines);
}

function part2(lines: number[][]): number {
  return overlaps(lines, true)
}

Deno.test("Day 5, Part 1:", async () => {
  const input = await readInput();
  const lines = parseInput(input);
  console.log(util.format(part1(lines)));
});

Deno.test("Day 5, Part 2:", async () => {
  const input = await readInput();
  const lines = parseInput(input);
  console.log(util.format(part2(lines)));
});
