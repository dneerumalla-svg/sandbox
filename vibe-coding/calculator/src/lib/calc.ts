// Safe expression evaluator using shunting-yard + RPN.
// Supports + - * / % ^, parentheses, unary minus, and functions:
// sin, cos, tan, asin, acos, atan, ln, log, sqrt, exp, abs, fact
// Constants: pi, e
// Trig uses degrees or radians based on `angleMode`.

export type AngleMode = "deg" | "rad";

type Token =
  | { type: "num"; value: number }
  | { type: "op"; value: string }
  | { type: "func"; value: string }
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "comma" };

const FUNCS = new Set([
  "sin", "cos", "tan", "asin", "acos", "atan",
  "ln", "log", "sqrt", "exp", "abs", "fact",
]);

const PRECEDENCE: Record<string, number> = {
  "+": 2, "-": 2, "*": 3, "/": 3, "%": 3, "^": 4, "u-": 5,
};
const RIGHT_ASSOC = new Set(["^", "u-"]);

function tokenize(input: string): Token[] {
  const s = input.replace(/\s+/g, "");
  const tokens: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if ((c >= "0" && c <= "9") || c === ".") {
      let j = i;
      while (j < s.length && ((s[j] >= "0" && s[j] <= "9") || s[j] === ".")) j++;
      const num = parseFloat(s.slice(i, j));
      if (Number.isNaN(num)) throw new Error("Invalid number");
      tokens.push({ type: "num", value: num });
      i = j;
      continue;
    }
    if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
      let j = i;
      while (j < s.length && ((s[j] >= "a" && s[j] <= "z") || (s[j] >= "A" && s[j] <= "Z"))) j++;
      const name = s.slice(i, j).toLowerCase();
      if (name === "pi") tokens.push({ type: "num", value: Math.PI });
      else if (name === "e") tokens.push({ type: "num", value: Math.E });
      else if (FUNCS.has(name)) tokens.push({ type: "func", value: name });
      else throw new Error(`Unknown identifier: ${name}`);
      i = j;
      continue;
    }
    if ("+-*/^%".includes(c)) {
      tokens.push({ type: "op", value: c });
      i++;
      continue;
    }
    if (c === "(") { tokens.push({ type: "lparen" }); i++; continue; }
    if (c === ")") { tokens.push({ type: "rparen" }); i++; continue; }
    if (c === ",") { tokens.push({ type: "comma" }); i++; continue; }
    throw new Error(`Unexpected character: ${c}`);
  }
  return tokens;
}

function toRPN(tokens: Token[]): Token[] {
  const out: Token[] = [];
  const stack: Token[] = [];
  let prev: Token | null = null;
  for (const t of tokens) {
    if (t.type === "num") {
      out.push(t);
    } else if (t.type === "func") {
      stack.push(t);
    } else if (t.type === "op") {
      let op = t.value;
      const isUnary =
        (op === "-" || op === "+") &&
        (prev === null ||
          (prev.type === "op") ||
          prev.type === "lparen" ||
          prev.type === "comma");
      if (isUnary) {
        if (op === "-") {
          const u: Token = { type: "op", value: "u-" };
          stack.push(u);
          prev = u;
          continue;
        } else {
          prev = t;
          continue; // ignore unary +
        }
      }
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type === "func") { out.push(stack.pop()!); continue; }
        if (top.type === "op") {
          const pa = PRECEDENCE[op];
          const pb = PRECEDENCE[top.value];
          if (pb > pa || (pb === pa && !RIGHT_ASSOC.has(op))) {
            out.push(stack.pop()!);
            continue;
          }
        }
        break;
      }
      stack.push({ type: "op", value: op });
    } else if (t.type === "lparen") {
      stack.push(t);
    } else if (t.type === "rparen") {
      while (stack.length && stack[stack.length - 1].type !== "lparen") {
        out.push(stack.pop()!);
      }
      if (!stack.length) throw new Error("Mismatched parentheses");
      stack.pop(); // remove lparen
      if (stack.length && stack[stack.length - 1].type === "func") {
        out.push(stack.pop()!);
      }
    }
    prev = t;
  }
  while (stack.length) {
    const top = stack.pop()!;
    if (top.type === "lparen" || top.type === "rparen") throw new Error("Mismatched parentheses");
    out.push(top);
  }
  return out;
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("fact needs a non-negative integer");
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function evalRPN(rpn: Token[], angle: AngleMode): number {
  const stack: number[] = [];
  const toRad = (x: number) => (angle === "deg" ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (angle === "deg" ? (x * 180) / Math.PI : x);
  for (const t of rpn) {
    if (t.type === "num") stack.push(t.value);
    else if (t.type === "op") {
      if (t.value === "u-") {
        const a = stack.pop();
        if (a === undefined) throw new Error("Invalid expression");
        stack.push(-a);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) throw new Error("Invalid expression");
        switch (t.value) {
          case "+": stack.push(a + b); break;
          case "-": stack.push(a - b); break;
          case "*": stack.push(a * b); break;
          case "/":
            if (b === 0) throw new Error("Division by zero");
            stack.push(a / b); break;
          case "%": stack.push(a % b); break;
          case "^": stack.push(Math.pow(a, b)); break;
          default: throw new Error("Unknown operator");
        }
      }
    } else if (t.type === "func") {
      const a = stack.pop();
      if (a === undefined) throw new Error("Invalid expression");
      switch (t.value) {
        case "sin": stack.push(Math.sin(toRad(a))); break;
        case "cos": stack.push(Math.cos(toRad(a))); break;
        case "tan": stack.push(Math.tan(toRad(a))); break;
        case "asin": stack.push(fromRad(Math.asin(a))); break;
        case "acos": stack.push(fromRad(Math.acos(a))); break;
        case "atan": stack.push(fromRad(Math.atan(a))); break;
        case "ln": stack.push(Math.log(a)); break;
        case "log": stack.push(Math.log10(a)); break;
        case "sqrt": stack.push(Math.sqrt(a)); break;
        case "exp": stack.push(Math.exp(a)); break;
        case "abs": stack.push(Math.abs(a)); break;
        case "fact": stack.push(factorial(a)); break;
        default: throw new Error("Unknown function");
      }
    }
  }
  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

// Normalize user-facing tokens (×, ÷, −, π) into evaluator syntax.
export function normalize(expr: string): string {
  return expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt");
}

export function evaluate(expr: string, angle: AngleMode = "deg"): number {
  const tokens = tokenize(normalize(expr));
  const rpn = toRPN(tokens);
  const result = evalRPN(rpn, angle);
  if (!Number.isFinite(result)) throw new Error("Result is not finite");
  return result;
}

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e12 || abs < 1e-6) return n.toExponential(6).replace(/\.?0+e/, "e");
  if (Number.isInteger(n)) return n.toLocaleString("en-US");
  const [intPart, decPart] = n.toString().split(".");
  const intFormatted = parseInt(intPart, 10).toLocaleString("en-US");
  const dec = (decPart ?? "").slice(0, 10).replace(/0+$/, "");
  return dec ? `${intFormatted}.${dec}` : intFormatted;
}
