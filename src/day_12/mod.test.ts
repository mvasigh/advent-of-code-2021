import { readInputStr, format } from "../util.ts";

function parseInput(input: string): Record<string, string[]> {
  const nodes = Array.from(
    new Set([...input.matchAll(/\w+/g)].map((m) => m[0].trim()))
  ).reduce((dict, node) => {
    dict[node] = [];
    return dict;
  }, {} as Record<string, string[]>);

  for (const line of input.split("\n")) {
    const [matchA, matchB] = [...line.matchAll(/\w+/g)].map((m) => m[0]);
    matchB !== "start" && nodes[matchA].push(matchB);
    matchA !== "start" && nodes[matchB].push(matchA);
  }

  return nodes;
}

const isLower = (str: string) =>
  str === str.toLowerCase() && str !== "start" && str !== "end";

function traverse(
  nodes: Record<string, string[]>,
  node: string,
  options?: {
    visited?: { once: Record<string, boolean>; twice: string };
    double?: boolean;
    path?: string[];
  }
): number {
  let { once, twice } = options?.visited ?? {
    once: {},
    twice: '',
  };
  const double = options?.double ?? false;
  const path = options?.path ?? [];

  if (node === "end") return 1;

  if (isLower(node)) {
    if (double) {
      if (twice === node) return 0;
      if (twice && once[node]) return 0;
    } else {
      if (once[node]) return 0;
    }

    once[node] ? (twice = node) : (once[node] = true);
  }

  return nodes[node].reduce(
    (sum, n) =>
      sum +
      traverse(nodes, n, {
        visited: { once: { ...once }, twice },
        double,
        path: [...path, node],
      }),
    0
  );
}

function part1(nodes: Record<string, string[]>): number {
  return traverse(nodes, "start");
}

function part2(nodes: Record<string, string[]>): number {
  return traverse(nodes, "start", { double: true });
}

Deno.test("Day 12, Part 1:", async () => {
  const nodes = await readInputStr(12).then(parseInput);
  console.log(format(part1(nodes)));
});

Deno.test("Day 12, Part 2:", async () => {
  const nodes = await readInputStr(12).then(parseInput);
  console.log(format(part2(nodes)));
});
