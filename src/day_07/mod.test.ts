import { format, readInputStr, extractNums, range } from "../util.ts";

function bestPos(crabs: number[], greedy = false): number {
  const [min, max] = [Math.min(...crabs), Math.max(...crabs)];
  return range(max - min).reduce((best, i) =>
    Math.min(
      best || Infinity,
      crabs.reduce((sum, crab) => {
        const diff = Math.abs(crab - (min + i));
        return sum + (greedy ? ((diff + 1) * diff) / 2 : diff);
      }, 0)
    )
  );
}

const part1 = (crabs: number[]): number => bestPos(crabs);
const part2 = (crabs: number[]): number => bestPos(crabs, true);

Deno.test("Day 7, Part 1:", async () => {
  const input = await readInputStr(7);
  console.log(format(part1(extractNums(input))));
});

Deno.test("Day 7, Part 2:", async () => {
  const input = await readInputStr(7);
  console.log(format(part2(extractNums(input))));
});
