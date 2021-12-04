import * as util from "../util.ts";

interface Board {
  rows: { [key: string]: number };
  cols: { [key: string]: number };
  sq: { [key: string]: number };
}

async function readInput(): Promise<string> {
  const txt = await Deno.readTextFile("src/day_04/input.txt");
  return txt.trim();
}

function parseInput(input: string): [number[], Board[]] {
  const numbers = input
    .match(/(\d+,)+\d+\n/)?.[0]
    .trim()
    .split(",")
    .map((n) => parseInt(n, 10)) as unknown as number[];

  const boards = [...input.matchAll(/([\d ]+\n?){5}/g)].map((m) =>
    [...m[0].matchAll(/\d+/g)].reduce(
      (map, v, i) => ({ ...map, sq: { ...map.sq, [parseInt(v[0])]: i } }),
      { sq: {}, rows: {}, cols: {} }
    )
  );

  return [numbers, boards];
}

const row = (i: number) => Math.floor(i / 5);
const col = (i: number) => i % 5;

function part1(numbers: number[], boards: Board[]): number {
  const nums = new Set();
  let num, i;
  while ((num = numbers.shift()) != null && nums.add(num)) {
    for (const board of boards) {
      if ((i = board.sq[num]) != null) {
        board.rows[row(i)] = (board.rows[row(i)] || 0) + 1;
        board.cols[col(i)] = (board.cols[col(i)] || 0) + 1;
      }

      if (board.rows[row(i)] === 5 || board.cols[col(i)] === 5)
        return (
          num *
          Object.keys(board.sq)
            .map((k) => parseInt(k, 10))
            .filter((v) => !nums.has(v))
            .reduce((acc, curr) => acc + curr, 0)
        );
    }
  }

  return -1;
}

function part2(numbers: number[], boards: Board[]): number {
  const nums = new Set();
  let lastSum = -1;
  let num, i;
  while ((num = numbers.shift()) != null && nums.add(num)) {
    for (const board of boards) {
      if ((i = board.sq[num]) != null) {
        board.rows[row(i)] = (board.rows[row(i)] || 0) + 1;
        board.cols[col(i)] = (board.cols[col(i)] || 0) + 1;
      }

      if (board.rows[row(i)] > 4 || board.cols[col(i)] > 4) {
        boards = boards.filter((b) => b !== board);
        lastSum =
          num *
          Object.keys(board.sq)
            .map((k) => parseInt(k, 10))
            .filter((v) => !nums.has(v))
            .reduce((acc, curr) => acc + curr);
      }
    }
  }

  return lastSum;
}

Deno.test("Day 4, Part 1:", async () => {
  const input = await readInput();
  const [numbers, boards] = parseInput(input);
  console.log(util.format(part1(numbers, boards)));
});

Deno.test("Day 4, Part 2:", async () => {
  const input = await readInput();
  const [numbers, boards] = parseInput(input);
  console.log(util.format(part2(numbers, boards)));
});
