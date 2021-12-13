import { readInputStr, format, extractNums, lines } from "../util.ts";

function parseInput(input: string): [string[], number[][]] {
  const [pointsRaw, foldsRaw] = input.trim().split("\n\n");
  return [
    lines(pointsRaw),
    lines(foldsRaw).map((l) => {
      const [axis, val] = l.replace("fold along", "").trim().split("=");
      return axis === "x" ? [Number(val), 0] : [0, Number(val)];
    }),
  ];
}

function fold(
  points: string[],
  folds: number[][],
  limit = Infinity
): Set<string> {
  let set = new Set(points);

  for (let i = 0; i < folds.length; i++) {
    if (i >= limit) break;

    const _set = new Set<string>();

    for (const pt of set) {
      const [xFold, yFold] = folds[i];
      let [x, y] = pt.split(",").map(Number);

      if (xFold && x > xFold) x -= 2 * (x - xFold);
      if (yFold && y > yFold) y -= 2 * (y - yFold);

      _set.add([x, y].join(","));
    }

    set = _set;
  }

  return set;
}

function part1(points: string[], folds: number[][]): number {
  return fold(points, folds, 1).size;
}

function part2(points: string[], folds: number[][]): string {
  const folded = fold(points, folds);
  const pts = [...folded].map((pt) => extractNums(pt));
  const [maxX, maxY] = pts.reduce(
    ([maxX, maxY], [x, y]) => [Math.max(maxX, x), Math.max(maxY, y)],
    [-Infinity, -Infinity]
  );
  const mat = Array.from({ length: maxY + 3 }, () =>
    Array.from({ length: maxX + 3 })
  );

  for (let y = 0; y < mat.length; y++) {
    for (let x = 0; x < mat[y].length; x++) {
      mat[y][x] = folded.has([x - 1, y - 1].join(",")) ? "█" : " ";
    }
  }

  return "\n" + mat.map((l) => l.join("")).join("\n");
}

Deno.test("Day 13, Part 1:", async () => {
  const [points, folds] = await readInputStr(13).then(parseInput);
  console.log(format(part1(points, folds)));
});

Deno.test("Day 13, Part 2:", async () => {
  const [points, folds] = await readInputStr(13).then(parseInput);
  console.log(format(part2(points, folds)));
});
