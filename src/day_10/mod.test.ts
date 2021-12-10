import { readInputStr, format } from "../util.ts";

const parseInput = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((l) => l.trim());

const chunks: Record<string, [string, number, number]> = {
  ")": ["(", 3, 1],
  "]": ["[", 57, 2],
  "}": ["{", 1197, 3],
  ">": ["<", 25137, 4],
};
const openers = new Set(Object.values(chunks).map((v) => v[0]));
const flipped: Record<string, [string, number, number]> = Object.fromEntries(
  Object.entries(chunks).map(([key, [o, ...val]]) => [o, [key, ...val]])
);

function parseChunks(lines: string[]): [number, number] {
  const complete = [];
  let syntax = 0;

  outer: for (const line of lines) {
    const stack = [];

    for (const char of line) {
      if (openers.has(char) || !stack.length) {
        stack.push(char);
      } else {
        if (chunks[char][0] !== stack.pop()) {
          syntax += chunks[char][1];
          continue outer;
        }
      }
    }

    if (stack.length) {
      complete.push(
        stack.reverse().reduce((sum, char) => sum * 5 + flipped[char][2], 0)
      );
    }
  }

  return [
    syntax,
    complete.sort((a, b) => a - b)[Math.floor(complete.length / 2)],
  ];
}

function part1(lines: string[]): number {
  return parseChunks(lines)[0];
}

function part2(lines: string[]): number {
  return parseChunks(lines)[1];
}

Deno.test("Day 10, Part 1:", async () => {
  const input = await readInputStr(10).then(parseInput);
  console.log(format(part1(input)));
});

Deno.test("Day 10, Part 2:", async () => {
  const input = await readInputStr(10).then(parseInput);
  console.log(format(part2(input)));
});
