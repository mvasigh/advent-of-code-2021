import { readInputStr, lines, format, bench } from "../util.ts";

type Player = {
  pos: number;
  score: number;
};

function parseInput(input: string): Player[] {
  return lines(input).map((l) => {
    return {
      pos: Number(l[l.length - 1]),
      score: 0,
    };
  });
}

const newPos = (pos: number, roll: number) => (pos + roll) % 10 || 10;

function move(player: Player, rolls: number[]) {
  const sum = rolls.reduce((s, curr) => (s + curr) % 100 || 100, 0);
  player.pos = (player.pos + sum) % 10 || 10;
  player.score += player.pos;
}

const merge = (arrs: [number, number][]): [number, number] =>
  arrs.reduce((s, curr) => [s[0] + curr[0], s[1] + curr[1]], [0, 0]);

const mult = (arrs: [number, number][]): [number, number] =>
  arrs.reduce((s, curr) => [s[0] * curr[0], s[1] * curr[1]], [1, 1]);

function getCombos() {
  const combos: number[] = [];
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        combos.push([i, j, k].reduce((s, curr) => s + curr));
      }
    }
  }

  return Object.entries(
    combos.reduce((cts, num) => {
      if (!cts[num]) cts[num] = 0;
      cts[num] += 1;
      return cts;
    }, {} as Record<string, number>)
  ).map(([a, b]) => [Number(a), Number(b)]);
}

function part1(players: Player[]): number {
  const [a, b] = players;
  let die = 0;

  while (a.score < 1000 && b.score < 1000) {
    const active = (die / 3) % 2 === 0 ? a : b;
    move(active, [die + 1, die + 2, die + 3]);
    die += 3;
  }

  return Math.min(a.score, b.score) * die;
}

// TODO: add cache
function part2(players: Player[]): number {
  const { a, b } = { a: players[0], b: players[1] };

  const combos = getCombos();

  function game(
    sa: number,
    pa: number,
    sb: number,
    pb: number,
    roll: number,
    weight: number
  ): [number, number] {
    if (sa >= 21) return [weight, 0];
    if (sb >= 21) return [0, weight];

    const active = roll % 2 === 0 ? "a" : "b";

    if (active === "a") {
      return mult([
        [weight, weight],
        merge(
          combos.map(([c, w]) => {
            return game(sa + newPos(pa, c), newPos(pa, c), sb, pb, roll + 1, w);
          })
        ),
      ]);
    } else {
      return mult([
        [weight, weight],
        merge(
          combos.map(([c, w]) => {
            return game(sa, pa, sb + newPos(pb, c), newPos(pb, c), roll + 1, w);
          })
        ),
      ]);
    }
  }

  const [aWins, bWins] = game(a.score, a.pos, b.score, b.pos, 0, 1);

  return Math.max(aWins, bWins);
}

Deno.test("Day 21, Part 1:", async () => {
  const input = await readInputStr(21).then(parseInput);
  const [result, time] = bench(() => part1(input));
  console.log(format(result), `(${time} ms)`);
});

Deno.test("Day 21, Part 2:", async () => {
  const input = await readInputStr(21).then(parseInput);
  const [result, time] = bench(() => part2(input));
  console.log(format(result), `(${time} ms)`);
});
