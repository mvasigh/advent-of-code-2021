import { readInputStr, format, lines, bench } from "../util.ts";

function parseInput(input: string): [string, Record<string, string>] {
  const [template, rulesRaw] = input.trim().split("\n\n");
  const rules = lines(rulesRaw).map((l) => l.trim().split(" -> "));

  return [template.trim(), Object.fromEntries(rules)];
}

const add = (obj: Record<string, number>, key: string, val: number) => {
  if (!obj[key]) obj[key] = 0;
  obj[key] += val;
};

function splitPairs(
  txt: string
): [Record<string, number>, Record<string, number>] {
  const [pairs, chars]: Record<string, number>[] = [{}, {}];

  for (let i = 0; i < txt.length; i++) {
    add(chars, txt[i], 1);
    if (txt[i + 1]) add(pairs, txt[i] + txt[i + 1], 1);
  }

  return [pairs, chars];
}

function step(
  _pairs: Record<string, number>,
  _chars: Record<string, number>,
  rules: Record<string, string>
): [Record<string, number>, Record<string, number>] {
  const [pairs, chars] = [{ ..._pairs }, { ..._chars }];

  for (const [p, i] of Object.entries(rules)) {
    if (!_pairs[p]) continue;

    [p[0] + i, i + p[1]].forEach((key) => add(pairs, key, _pairs[p]));
    add(chars, i, _pairs[p]);
    pairs[p] -= _pairs[p];
  }

  return [pairs, chars];
}

function steps(
  template: string,
  rules: Record<string, string>,
  limit = 10
): number {
  let data = splitPairs(template);

  for (let i = 0; i < limit; i++) {
    data = step(...data, rules);
  }

  return (
    Math.max(...Object.values(data[1])) - Math.min(...Object.values(data[1]))
  );
}

function part1(template: string, rules: Record<string, string>): number {
  return steps(template, rules, 10);
}

function part2(template: string, rules: Record<string, string>): number {
  return steps(template, rules, 40);
}

Deno.test("Day 14, Part 1:", async () => {
  const [template, rules] = await readInputStr(14).then(parseInput);
  const [result, time] = bench(() => part1(template, rules));
  console.log(format(result), `(${time} ms)`);
});

Deno.test("Day 14, Part 2:", async () => {
  const [template, rules] = await readInputStr(14).then(parseInput);
  const [result, time] = bench(() => part2(template, rules));
  console.log(format(result), `(${time} ms)`);
});
