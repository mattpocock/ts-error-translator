export function A(b: number): number {
  return b;
}
A("test")


let a: { m: number[] };
let b = { m: [""] };
a = b;

// Extra Properties

type A = { m: number };
const w: A = { m: 10, n: "" };

// Union Assignments

type Thing = "none" | { name: string };
const e: Thing = { name: 0 };