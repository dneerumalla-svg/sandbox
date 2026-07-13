import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { evaluate, formatNumber, type AngleMode } from "@/lib/calc";
import { cn } from "@/lib/utils";

type HistoryItem = { expr: string; result: string };

type ButtonKind = "num" | "op" | "fn" | "eq" | "sci";

type BtnDef = {
  label: string;
  insert?: string;
  action?: string;
  kind: ButtonKind;
  wide?: boolean;
};

export default function Calculator() {
  const [expr, setExpr] = useState("");
  const [answer, setAnswer] = useState("0");
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [error, setError] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dark, setDark] = useState(true);
  const [angle, setAngle] = useState<AngleMode>("deg");
  const [showSci, setShowSci] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);
  const lastAnswer = useRef<number | null>(null);

  // Apply dark mode class
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // Live preview
  const preview = useMemo(() => {
    if (!expr.trim()) return "";
    try {
      const v = evaluate(expr, angle);
      return formatNumber(v);
    } catch {
      return "";
    }
  }, [expr, angle]);

  const displayMain = justEvaluated || !expr ? answer : preview || answer;
  const displayExpr = expr || (justEvaluated ? "" : "");

  const insert = useCallback((token: string) => {
    setError(false);
    setExpr((prev) => {
      if (justEvaluated) {
        setJustEvaluated(false);
        // Continue with answer if operator, else fresh start
        if (/^[+\-*/×÷^%)]$/.test(token) && lastAnswer.current !== null) {
          return String(lastAnswer.current) + token;
        }
        return token;
      }
      return prev + token;
    });
  }, [justEvaluated]);

  const clearAll = useCallback(() => {
    setExpr("");
    setAnswer("0");
    setError(false);
    setJustEvaluated(false);
  }, []);

  const backspace = useCallback(() => {
    if (justEvaluated) { setJustEvaluated(false); return; }
    setExpr((p) => p.slice(0, -1));
  }, [justEvaluated]);

  const equals = useCallback(() => {
    if (!expr.trim()) return;
    try {
      const v = evaluate(expr, angle);
      const formatted = formatNumber(v);
      setAnswer(formatted);
      setHistory((h) => [{ expr, result: formatted }, ...h].slice(0, 50));
      lastAnswer.current = v;
      setJustEvaluated(true);
      setError(false);
    } catch (e) {
      setAnswer("Error");
      setError(true);
    }
  }, [expr, angle]);

  const toggleSign = useCallback(() => {
    setExpr((prev) => {
      const t = prev.trim();
      if (!t) return t;
      if (t.startsWith("-(") && t.endsWith(")")) return t.slice(2, -1);
      return `-(${t})`;
    });
    setJustEvaluated(false);
  }, []);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (/^[0-9.]$/.test(k)) { flash(k); insert(k); }
      else if (k === "+" || k === "-") { flash(k); insert(k); }
      else if (k === "*") { flash("×"); insert("×"); }
      else if (k === "/") { e.preventDefault(); flash("÷"); insert("÷"); }
      else if (k === "^") { flash("^"); insert("^"); }
      else if (k === "%") { flash("%"); insert("%"); }
      else if (k === "(" || k === ")") { flash(k); insert(k); }
      else if (k === "Enter" || k === "=") { e.preventDefault(); flash("="); equals(); }
      else if (k === "Backspace") { flash("DEL"); backspace(); }
      else if (k === "Escape") { flash("AC"); clearAll(); }
    };
    const flash = (l: string) => {
      setPressed(l);
      window.setTimeout(() => setPressed((p) => (p === l ? null : p)), 120);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [insert, equals, backspace, clearAll]);

  // Auto-shrink main display font
  const mainFontSize = useMemo(() => {
    const len = displayMain.length;
    if (len <= 8) return "text-7xl sm:text-8xl";
    if (len <= 12) return "text-6xl sm:text-7xl";
    if (len <= 16) return "text-5xl sm:text-6xl";
    if (len <= 22) return "text-4xl sm:text-5xl";
    return "text-3xl sm:text-4xl";
  }, [displayMain]);

  const sciButtons: BtnDef[] = [
    { label: "sin", insert: "sin(", kind: "sci" },
    { label: "cos", insert: "cos(", kind: "sci" },
    { label: "tan", insert: "tan(", kind: "sci" },
    { label: "ln",  insert: "ln(",  kind: "sci" },
    { label: "log", insert: "log(", kind: "sci" },
    { label: "√",   insert: "sqrt(", kind: "sci" },
    { label: "π",   insert: "π",    kind: "sci" },
    { label: "e",   insert: "e",    kind: "sci" },
    { label: "x!",  insert: "fact(", kind: "sci" },
    { label: "eˣ",  insert: "exp(", kind: "sci" },
  ];

  const mainButtons: BtnDef[] = [
    { label: "AC", action: "clear", kind: "fn" },
    { label: "( )", action: "paren", kind: "fn" },
    { label: "%", insert: "%", kind: "fn" },
    { label: "÷", insert: "÷", kind: "op" },

    { label: "7", insert: "7", kind: "num" },
    { label: "8", insert: "8", kind: "num" },
    { label: "9", insert: "9", kind: "num" },
    { label: "×", insert: "×", kind: "op" },

    { label: "4", insert: "4", kind: "num" },
    { label: "5", insert: "5", kind: "num" },
    { label: "6", insert: "6", kind: "num" },
    { label: "−", insert: "-", kind: "op" },

    { label: "1", insert: "1", kind: "num" },
    { label: "2", insert: "2", kind: "num" },
    { label: "3", insert: "3", kind: "num" },
    { label: "+", insert: "+", kind: "op" },

    { label: "±", action: "sign", kind: "num" },
    { label: "0", insert: "0", kind: "num" },
    { label: ".", insert: ".", kind: "num" },
    { label: "=", action: "eq", kind: "eq" },
  ];

  const handleParen = () => {
    // Smart parenthesis: insert ( if balanced/opens needed, else )
    const opens = (expr.match(/\(/g) || []).length;
    const closes = (expr.match(/\)/g) || []).length;
    const last = expr.slice(-1);
    if (opens <= closes || /[+\-*/×÷^(%,]/.test(last) || expr === "") insert("(");
    else insert(")");
  };

  const runBtn = (b: BtnDef) => {
    setPressed(b.label);
    window.setTimeout(() => setPressed((p) => (p === b.label ? null : p)), 120);
    if (b.action === "clear") return clearAll();
    if (b.action === "sign") return toggleSign();
    if (b.action === "eq") return equals();
    if (b.action === "paren") return handleParen();
    if (b.insert) return insert(b.insert);
  };

  const btnClass = (kind: ButtonKind, isPressed: boolean) =>
    cn(
      "relative select-none rounded-full font-medium transition-all duration-150",
      "active:scale-95 active:brightness-125",
      "shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_8px_20px_-8px_rgba(0,0,0,0.5)]",
      "flex items-center justify-center",
      kind === "num" && "bg-[color:var(--btn-num)] text-[color:var(--btn-num-fg)] hover:brightness-110",
      kind === "op"  && "bg-[color:var(--btn-op)] text-[color:var(--btn-op-fg)] hover:brightness-110",
      kind === "fn"  && "bg-[color:var(--btn-fn)] text-[color:var(--btn-fn-fg)] hover:brightness-110",
      kind === "eq"  && "bg-gradient-to-b from-[color:var(--btn-eq-from)] to-[color:var(--btn-eq-to)] text-white hover:brightness-110",
      kind === "sci" && "bg-[color:var(--btn-sci)] text-[color:var(--btn-sci-fg)] hover:brightness-110 text-sm",
      isPressed && "scale-95 brightness-125",
    );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[color:var(--app-bg)] transition-colors">
      {/* Local theme tokens for the calculator */}
      <style>{`
        :root {
          --app-bg: #f2f2f7;
          --panel-bg: rgba(255,255,255,0.7);
          --panel-border: rgba(0,0,0,0.08);
          --display-bg: #ffffff;
          --display-fg: #0b0b0f;
          --display-dim: rgba(11,11,15,0.5);
          --btn-num: #ffffff;
          --btn-num-fg: #0b0b0f;
          --btn-fn: #d1d1d6;
          --btn-fn-fg: #0b0b0f;
          --btn-op: #ff9f0a;
          --btn-op-fg: #ffffff;
          --btn-eq-from: #ff9f0a;
          --btn-eq-to: #ff7a00;
          --btn-sci: #e5e5ea;
          --btn-sci-fg: #0b0b0f;
        }
        .dark {
          --app-bg: #000000;
          --panel-bg: rgba(28,28,30,0.6);
          --panel-border: rgba(255,255,255,0.08);
          --display-bg: #0b0b0f;
          --display-fg: #ffffff;
          --display-dim: rgba(255,255,255,0.5);
          --btn-num: #333336;
          --btn-num-fg: #ffffff;
          --btn-fn: #a5a5a5;
          --btn-fn-fg: #0b0b0f;
          --btn-op: #ff9f0a;
          --btn-op-fg: #ffffff;
          --btn-eq-from: #ff9f0a;
          --btn-eq-to: #ff7a00;
          --btn-sci: #1c1c1e;
          --btn-sci-fg: #ffffff;
        }
      `}</style>

      <div className="w-full max-w-4xl grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
        {/* Calculator card */}
        <div
          className={cn(
            "rounded-[2rem] p-5 sm:p-6 backdrop-blur-xl",
            "border border-[color:var(--panel-border)]",
            "bg-[color:var(--panel-bg)]",
            "shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]",
          )}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSci((s) => !s)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[color:var(--btn-sci)] text-[color:var(--btn-sci-fg)] hover:brightness-110 transition"
              >
                {showSci ? "Basic" : "Scientific"}
              </button>
              <button
                onClick={() => setAngle((a) => (a === "deg" ? "rad" : "deg"))}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[color:var(--btn-sci)] text-[color:var(--btn-sci-fg)] hover:brightness-110 transition"
                title="Toggle angle mode"
              >
                {angle.toUpperCase()}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[color:var(--btn-sci)] text-[color:var(--btn-sci-fg)] hover:brightness-110 transition md:hidden"
              >
                History
              </button>
              <button
                onClick={() => setDark((d) => !d)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[color:var(--btn-sci)] text-[color:var(--btn-sci-fg)] hover:brightness-110 transition"
                aria-label="Toggle dark mode"
              >
                {dark ? "☀︎" : "☾"}
              </button>
            </div>
          </div>

          {/* Display */}
          <div
            className={cn(
              "rounded-2xl px-5 py-6 mb-5 min-h-[140px] flex flex-col items-end justify-end",
              "bg-[color:var(--display-bg)] text-[color:var(--display-fg)]",
              "border border-[color:var(--panel-border)]",
            )}
          >
            <div className="text-sm sm:text-base font-mono text-[color:var(--display-dim)] truncate max-w-full">
              {displayExpr || "\u00A0"}
            </div>
            <div
              className={cn(
                "font-semibold tracking-tight tabular-nums leading-none transition-all",
                mainFontSize,
                error && "text-red-500",
              )}
            >
              {displayMain}
            </div>
          </div>

          {/* Scientific row */}
          {showSci && (
            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-3 animate-in fade-in slide-in-from-top-1 duration-200">
              {sciButtons.map((b) => (
                <button
                  key={b.label}
                  onClick={() => runBtn(b)}
                  className={cn(btnClass("sci", pressed === b.label), "h-11")}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}

          {/* Utility row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3">
            <button
              onClick={() => { setPressed("^"); insert("^"); setTimeout(() => setPressed(null), 120); }}
              className={cn(btnClass("fn", pressed === "^"), "h-14 text-lg")}
              title="Exponent"
            >
              xʸ
            </button>
            <button
              onClick={() => { setPressed("DEL"); backspace(); setTimeout(() => setPressed(null), 120); }}
              className={cn(btnClass("fn", pressed === "DEL"), "h-14 text-base")}
            >
              ⌫
            </button>
            <button
              onClick={() => { if (lastAnswer.current !== null) { setPressed("Ans"); insert(String(lastAnswer.current)); setTimeout(() => setPressed(null), 120); } }}
              className={cn(btnClass("fn", pressed === "Ans"), "h-14 text-sm")}
            >
              Ans
            </button>
            <button
              onClick={() => { setPressed("^2"); insert("^2"); setTimeout(() => setPressed(null), 120); }}
              className={cn(btnClass("fn", pressed === "^2"), "h-14 text-lg")}
            >
              x²
            </button>
          </div>

          {/* Main keypad */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {mainButtons.map((b) => (
              <button
                key={b.label}
                onClick={() => runBtn(b)}
                className={cn(btnClass(b.kind, pressed === b.label), "h-16 sm:h-[68px] text-2xl")}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* History panel */}
        <aside
          className={cn(
            "rounded-[2rem] p-5 backdrop-blur-xl overflow-hidden",
            "border border-[color:var(--panel-border)]",
            "bg-[color:var(--panel-bg)]",
            "shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]",
            "md:block",
            showHistory ? "block" : "hidden md:block",
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--display-dim)]">
              History
            </h2>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-xs font-semibold text-red-500 hover:opacity-80"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1">
            {history.length === 0 ? (
              <p className="text-sm text-[color:var(--display-dim)]">No calculations yet.</p>
            ) : (
              history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => { setExpr(h.expr); setJustEvaluated(false); setError(false); }}
                  className="w-full text-right rounded-xl p-3 hover:bg-black/5 dark:hover:bg-white/5 transition group"
                >
                  <div className="text-xs font-mono text-[color:var(--display-dim)] truncate">
                    {h.expr}
                  </div>
                  <div className="text-lg font-semibold text-[color:var(--display-fg)] tabular-nums">
                    = {h.result}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
