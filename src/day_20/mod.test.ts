import { readInputStr, lines, format, bench } from "../util.ts";

type Boundary = {
  minR: number;
  minC: number;
  maxR: number;
  maxC: number;
};

const key = (r: number, c: number) => `${r},${c}`;

const val = (
  b: Boundary,
  set: Set<string>,
  step: number,
  fallback: number,
  r: number,
  c: number
) => {
  if (
    step % 2 === 1 &&
    (r < b.minR || r > b.maxR || c < b.minC || c > b.maxC)
  ) {
    return fallback;
  }

  return set.has(key(r, c)) ? 1 : 0;
};

function parseInput(input: string): [Set<string>, boolean[]] {
  const [rawEnhancer, rawCells] = input.split("\n\n");

  const enhancer = rawEnhancer
    .trim()
    .replace(/\s/g, "")
    .split("")
    .map((c) => c === "#");

  const cells = lines(rawCells.trim()).reduce((set, l, r) => {
    l.trim()
      .split("")
      .forEach((cell, c) => {
        if (cell === "#") {
          set.add(key(r, c));
        }
      });

    return set;
  }, new Set<string>());

  return [cells, enhancer];
}

function bounds(cells: Set<string>): Boundary {
  let minR = Infinity;
  let maxR = -Infinity;
  let minC = Infinity;
  let maxC = -Infinity;

  for (const cell of cells) {
    const [r, c] = cell.split(",").map(Number);
    minR = Math.min(minR, r);
    minC = Math.min(minC, c);
    maxR = Math.max(maxR, r);
    maxC = Math.max(maxC, c);
  }

  return { minR, minC, maxR, maxC };
}

function step(
  cells: Set<string>,
  enhancer: boolean[],
  step: number
): Set<string> {
  const result = new Set<string>();
  const b = bounds(cells);

  for (let r = b.minR - 1; r <= b.maxR + 1; r++) {
    for (let c = b.minC - 1; c <= b.maxC + 1; c++) {
      const bin = [
        [r - 1, c - 1],
        [r - 1, c],
        [r - 1, c + 1],
        [r, c - 1],
        [r, c],
        [r, c + 1],
        [r + 1, c - 1],
        [r + 1, c],
        [r + 1, c + 1],
      ].reduce(
        (str, [_r, _c]) =>
          (str += val(b, cells, step, Number(enhancer[0]), _r, _c)),
        ""
      );

      const index = parseInt(bin, 2);

      if (enhancer[index]) {
        result.add(key(r, c));
      }
    }
  }

  return result;
}

function part1(cells: Set<string>, enhancer: boolean[]): number {
  for (let i = 0; i < 2; i++) {
    cells = step(cells, enhancer, i);
  }

  return cells.size;
}

function part2(cells: Set<string>, enhancer: boolean[]): number {
  for (let i = 0; i < 50; i++) {
    cells = step(cells, enhancer, i);
  }

  return cells.size;
}

Deno.test("Day 20, Part 1:", async () => {
  const input = await readInputStr(20).then(parseInput);
  const [result, time] = bench(() => part1(...input));
  console.log(format(result), `(${time} ms)`);
});

Deno.test("Day 20, Part 2:", async () => {
  const input = await readInputStr(20).then(parseInput);
  const [result, time] = bench(() => part2(...input));
  console.log(format(result), `(${time} ms)`);
});
