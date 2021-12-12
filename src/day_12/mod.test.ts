import { readInputStr, format } from "../util.ts";

function parseInput(input: string): Record<string, string[]> {
  return input
    .trim()
    .split("\n")
    .reduce((nodes, line) => {
      const [a, b] = [...line.trim().matchAll(/\w+/g)].map((m) => m[0]);

      return {
        ...nodes,
        [a]: (nodes[a] || []).concat(b === "start" ? [] : b),
        [b]: (nodes[b] || []).concat(a === "start" ? [] : a),
      };
    }, {} as Record<string, string[]>);
}

function traverse(
  nodes: Record<string, string[]>,
  node: string,
  double = false,
  once: Record<string, boolean> = {},
  twice = ""
): number {
  if (node === "end") return 1;

  if (/[a-z]+/.test(node)) {
    if (double && twice === node) return 0;
    if (double && twice && once[node]) return 0;
    if (!double && once[node]) return 0;
    once[node] ? (twice = node) : (once[node] = true);
  }

  return nodes[node].reduce(
    (sum, n) => sum + traverse(nodes, n, double, { ...once }, twice),
    0
  );
}

function part1(nodes: Record<string, string[]>): number {
  return traverse(nodes, "start");
}

function part2(nodes: Record<string, string[]>): number {
  return traverse(nodes, "start", true);
}

Deno.test("Day 12, Part 1:", async () => {
  const nodes = await readInputStr(12).then(parseInput);
  console.log(format(part1(nodes)));
});

Deno.test("Day 12, Part 2:", async () => {
  const nodes = await readInputStr(12).then(parseInput);
  console.log(format(part2(nodes)));
});
