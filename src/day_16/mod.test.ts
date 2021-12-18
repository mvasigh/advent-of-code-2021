import { readInputStr, format, bench } from "../util.ts";

type Packet = {
  root?: boolean;
  typeId?: number;
  version?: number;
  value?: number;
  children: Packet[];
};

type ParseOptions = {
  bits?: number;
  packets?: number;
};

function parseBin(arr: number[]): number {
  return parseInt(arr.join(""), 2);
}

function unpack(packed: string): number[] {
  return packed
    .split("")
    .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
    .join("")
    .split("")
    .map(Number);
}

function extractHeader(arr: number[]): { version: number; typeId: number } {
  const version = parseBin(arr.splice(0, 3));
  const typeId = parseBin(arr.splice(0, 3));

  return { version, typeId };
}

function extractLiteral(arr: number[]): number {
  let resume = true;
  const bits = [];

  while (resume) {
    const [_resume, ...chunk] = arr.splice(0, 5);
    bits.push(...chunk);
    resume = !!_resume;
  }

  return parseBin(bits);
}

function extractOperator(arr: number[], typeId: number): Packet {
  const lengthTypeId = parseBin(arr.splice(0, 1));
  const options: ParseOptions = {};

  if (lengthTypeId) {
    options.packets = parseBin(arr.splice(0, 11));
  } else {
    options.bits = parseBin(arr.splice(0, 15));
  }

  const children = parse(arr, options).children;

  let value = 0;
  if (typeId === 0) {
    value = children.reduce((sum, p) => sum + (p.value ?? 0), 0);
  } else if (typeId === 1) {
    value = children.reduce((sum, p) => sum * (p.value ?? 1), 1);
  } else if (typeId === 2) {
    value = Math.min(...children.map((p) => p.value ?? Infinity));
  } else if (typeId === 3) {
    value = Math.max(...children.map((p) => p.value ?? -Infinity));
  } else if (typeId === 5) {
    value = (children[0].value || 0) > (children[1].value || 0) ? 1 : 0;
  } else if (typeId === 6) {
    value = (children[0].value || 0) < (children[1].value || 0) ? 1 : 0;
  } else if (typeId === 7) {
    value = (children[0].value || 0) === (children[1].value || 0) ? 1 : 0;
  }

  return { children, value };
}

function parse(input: number[], options: ParseOptions = {}): Packet {
  const bitsLimit = options.bits ?? Infinity;
  const packetsLimit = options.packets ?? Infinity;
  const length = input.length - bitsLimit;

  const children: Packet[] = [];

  while (
    input.length >= 6 &&
    children.length < packetsLimit &&
    input.length > length
  ) {
    const { version, typeId } = extractHeader(input);

    if (typeId === 4) {
      children.push({
        children: [],
        value: extractLiteral(input),
        version,
        typeId,
      });
    } else {
      const { children: _children, value } = extractOperator(input, typeId);
      children.push({ children: _children, value, version, typeId });
    }
  }

  return { children };
}

function part1(input: string): number {
  const doc = parse(unpack(input));

  function sumVersions(node: Packet): number {
    return (
      (node.version || 0) +
      node.children.reduce((sum, n) => sum + sumVersions(n), 0)
    );
  }

  return sumVersions(doc);
}

function part2(input: string): number {
  const doc = parse(unpack(input));

  return doc.children[0].value || -1;
}

Deno.test("Day 16, Part 1:", async () => {
  const input = await readInputStr(16);
  const [result, time] = bench(() => part1(input));
  console.log(format(result), `(${time} ms)`);
});

Deno.test("Day 16, Part 2:", async () => {
  const input = await readInputStr(16);
  const [result, time] = bench(() => part2(input));
  console.log(format(result), `(${time} ms)`);
});
