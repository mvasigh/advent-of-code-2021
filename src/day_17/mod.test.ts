import { format, bench } from "../util.ts";

const target = {
  x: [209, 238],
  y: [-86, -59],
};

type Target = typeof target;

type Probe = {
  pos: [number, number];
  vel: [number, number];
};

function step(probe: Probe): Probe {
  const [x, y] = probe.pos;
  const [vx, vy] = probe.vel;

  return {
    pos: [x + vx, y + vy],
    vel: [vx ? (vx > 0 ? vx - 1 : vx + 1) : 0, vy - 1],
  };
}

function maxHeight(vel: [number, number], target: Target): number {
  let maxY = -Infinity;
  let hit = false;
  let probe: Probe = { vel, pos: [0, 0] };

  while (probe.pos[0] <= target.x[1] && probe.pos[1] >= target.y[0]) {
    maxY = Math.max(probe.pos[1], maxY);
    const [x, y] = probe.pos;

    if (
      x >= target.x[0] &&
      x <= target.x[1] &&
      y >= target.y[0] &&
      y <= target.y[1]
    ) {
      hit = true;
      break;
    }

    probe = step(probe);
  }

  return hit ? maxY : -Infinity;
}

function part1(target: Target): number {
  let bestHeight = 0;

  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      const max = maxHeight([x, y], target);
      bestHeight = Math.max(bestHeight, max);
    }
  }

  return bestHeight;
}

function part2(target: Target): number {
  let count = 0;

  for (let x = -500; x < 500; x++) {
    for (let y = -500; y < 500; y++) {
      const max = maxHeight([x, y], target);
      if (max !== -Infinity) {
        count += 1;
      }
    }
  }

  return count;
}

Deno.test("Day 17, Part 1:", () => {
  const [result, time] = bench(() => part1(target));
  console.log(format(result), `(${time} ms)`);
});

Deno.test("Day 17, Part 2:", () => {
  const [result, time] = bench(() => part2(target));
  console.log(format(result), `(${time} ms)`);
});
