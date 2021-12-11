import { readInputStr, format, exists } from "../util.ts";

const parseInput = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((l) => l.trim().split("").map(Number));

const key = (r: number, c: number) => `${r},${c}`;

function modelFlashes(octopuses: number[][]): [number, number] {
  let total100 = 0;
  let firstSync = 0;
  let flashed: Record<string, boolean> = {};
  let numFlashed = 0;

  function increase(r: number, c: number) {
    if (!exists(octopuses[r]?.[c])) return;
    if (flashed[key(r, c)]) return;

    octopuses[r][c] += 1;

    if (octopuses[r][c] > 9) {
      octopuses[r][c] = 0;
      flashed[key(r, c)] = true;
      numFlashed += 1;

      increase(r - 1, c - 1);
      increase(r - 1, c);
      increase(r - 1, c + 1);
      increase(r, c - 1);
      increase(r, c + 1);
      increase(r + 1, c - 1);
      increase(r + 1, c);
      increase(r + 1, c + 1);
    }
  }

  function step(i: number) {
    for (let r = 0; r < octopuses.length; r++) {
      for (let c = 0; c < octopuses[r].length; c++) {
        increase(r, c);
      }
    }

    if (!firstSync && numFlashed === 100) {
      firstSync = i + 1;
    }

    i < 100 && (total100 += numFlashed);
    numFlashed = 0;
    flashed = {};
  }

  let i = 0;
  while (!firstSync) {
    step(i);
    i++;
  }

  return [total100, firstSync];
}

function part1(octopuses: number[][]): number {
  return modelFlashes(octopuses)[0];
}

function part2(octopuses: number[][]): number {
  return modelFlashes(octopuses)[1];
}

Deno.test("Day 11, Part 1:", async () => {
  const input = await readInputStr(11).then(parseInput);
  console.log(format(part1(input)));
});

Deno.test("Day 11, Part 2:", async () => {
  const input = await readInputStr(11).then(parseInput);
  console.log(format(part2(input)));
});
