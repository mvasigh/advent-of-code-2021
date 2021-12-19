import { readInputStr, lines, format, bench, exists } from "../util.ts";

type Node = {
  data?: number;
  left?: Node;
  right?: Node;
};

function parse(raw: string): Node {
  const expr = eval(raw);

  if (typeof expr === "number") return { data: expr };

  return {
    left: parse(expr[0]),
    right: parse(expr[1]),
  };
}

function parseInput(input: string): Node[] {
  return lines(input).map((l) => parse(l));
}

function findRegular(
  root: Node,
  stop: Node,
  side: "left" | "right"
): Node | undefined {
  const opposite = side === "left" ? "right" : "left";
  let foundNode;
  let stopped = false;

  function visit(node: Node) {
    if (exists(node.data)) {
      foundNode = node;
    }
  }

  function traverse(node: Node) {
    if (node === stop) stopped = true;
    if (stopped) return;
    if (node[side]) traverse(node[side] as Node);
    visit(node);
    if (node[opposite]) traverse(node[opposite] as Node);
  }

  traverse(root);

  return foundNode;
}

function reduce(root: Node): Node {
  function explode(node: Node, depth: number): boolean {
    if (depth > 3 && node.left && node.right) {
      const left = findRegular(root, node, "left");
      const right = findRegular(root, node, "right");

      if (left && exists(left.data)) {
        left.data = (left.data || 0) + (node.left?.data as number) || 0;
      }

      if (right && exists(right.data)) {
        right.data = (right.data || 0) + (node.right?.data as number) || 0;
      }

      delete node.left;
      delete node.right;
      node.data = 0;

      return true;
    }

    return false;
  }

  function split(node: Node): boolean {
    if (node.data && node.data >= 10) {
      node.left = { data: Math.floor(node.data / 2) };
      node.right = { data: Math.ceil(node.data / 2) };
      delete node.data;

      return true;
    }

    return false;
  }

  function enqueue(
    node: Node,
    depth: number,
    queue: [Node, number, string][],
    action: string
  ) {
    if (node.left) {
      enqueue(node.left, depth + 1, queue, action);
    }

    queue.push([node, depth, action]);

    if (node.right) {
      enqueue(node.right, depth + 1, queue, action);
    }
  }

  let queue: [Node, number, string][] = [];
  enqueue(root, 0, queue, "explode");
  enqueue(root, 0, queue, "split");

  while (queue.length) {
    const [node, depth, action] = queue.shift() as [Node, number, string];

    if (action === "explode" ? explode(node, depth) : split(node)) {
      queue = [];
      enqueue(root, 0, queue, "explode");
      enqueue(root, 0, queue, "split");
    }
  }

  return root;
}

function add(left: Node, right: Node): Node {
  return { left, right };
}

function mag(root: Node): number {
  function traverse(node: Node): number {
    if (exists(node.data)) return node.data as number;

    return 3 * traverse(node.left as Node) + 2 * traverse(node.right as Node);
  }

  return traverse(root);
}

function part1(input: Node[]): number {
  let sum = input.shift() as Node;

  while (input.length) {
    sum = reduce(add(sum, input.shift() as Node));
  }

  return mag(sum);
}

function part2(input: string): number {
  const exprs = lines(input);
  let max = 0;

  for (let i = 0; i < exprs.length; i++) {
    for (let j = i + 1; j < exprs.length; j++) {
      const a = mag(reduce(add(parse(exprs[i]), parse(exprs[j]))));
      const b = mag(reduce(add(parse(exprs[j]), parse(exprs[i]))));

      max = Math.max(max, a, b);
    }
  }

  return max;
}

Deno.test("Day 18, Part 1:", async () => {
  const input = await readInputStr(18).then(parseInput);
  const [result, time] = bench(() => part1(input));
  console.log(format(result), `(${time} ms)`);
});

Deno.test("Day 18, Part 2:", async () => {
  const input = await readInputStr(18);
  const [result, time] = bench(() => part2(input));
  console.log(format(result), `(${time} ms)`);
});
