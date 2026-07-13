"""
calculator_ui.py
----------------
Tkinter GUI for the calculator.

The UI is deliberately modern and different from a stock calculator:
- Dark "smart display" panel at the top
- Previous-answer feed above the current expression
- Large bold answer text
- Rounded, color-coded button grid
- Scrollable calculation history panel on the right
- Keyboard support
- Resizable window
"""

import tkinter as tk
from tkinter import ttk, font

from calculator_logic import evaluate, format_number, CalculatorError


# ---------- Color palette (a custom modern theme) ----------
BG           = "#0e1116"   # window background
PANEL        = "#161b22"   # display panel
PANEL_SOFT   = "#1c232c"   # softer panel (history)
ACCENT       = "#5eead4"   # teal accent (equals, highlights)
ACCENT_DARK  = "#0d9488"
TEXT         = "#e6edf3"
TEXT_DIM     = "#7d8590"
BTN_NUM      = "#232b36"
BTN_NUM_HOV  = "#2d3644"
BTN_OP       = "#2a3340"
BTN_OP_HOV   = "#39455a"
BTN_FN       = "#3a2740"   # AC, DEL, %, ± ...
BTN_FN_HOV   = "#4c3355"
DANGER       = "#f97066"


class RoundButton(tk.Canvas):
    """A rounded rectangle button drawn on a Canvas.

    tk.Button can't do rounded corners cleanly across platforms,
    so we draw our own to keep the modern look consistent.
    """
    def __init__(self, master, text, command, *,
                 bg=BTN_NUM, hover=BTN_NUM_HOV, fg=TEXT,
                 font_spec=("Segoe UI", 16, "bold"), radius=16, **kw):
        super().__init__(master, bg=BG, highlightthickness=0,
                         bd=0, **kw)
        self.command = command
        self.bg = bg
        self.hover = hover
        self.fg = fg
        self.radius = radius
        self.text = text
        self.font_spec = font_spec
        self._current_bg = bg

        self.bind("<Configure>", self._redraw)
        self.bind("<Enter>",  lambda e: self._set_bg(self.hover))
        self.bind("<Leave>",  lambda e: self._set_bg(self.bg))
        self.bind("<Button-1>", lambda e: self._set_bg(ACCENT_DARK))
        self.bind("<ButtonRelease-1>", self._on_release)

    def _set_bg(self, color):
        self._current_bg = color
        self._redraw()

    def _on_release(self, event):
        self._set_bg(self.hover)
        # Only fire if release happens inside the widget
        if 0 <= event.x <= self.winfo_width() and 0 <= event.y <= self.winfo_height():
            if self.command:
                self.command()

    def _redraw(self, _event=None):
        self.delete("all")
        w = self.winfo_width()
        h = self.winfo_height()
        r = min(self.radius, w // 2, h // 2)
        # Rounded rectangle via polygon + arcs
        self.create_oval(0, 0, 2*r, 2*r, fill=self._current_bg, outline=self._current_bg)
        self.create_oval(w-2*r, 0, w, 2*r, fill=self._current_bg, outline=self._current_bg)
        self.create_oval(0, h-2*r, 2*r, h, fill=self._current_bg, outline=self._current_bg)
        self.create_oval(w-2*r, h-2*r, w, h, fill=self._current_bg, outline=self._current_bg)
        self.create_rectangle(r, 0, w-r, h, fill=self._current_bg, outline=self._current_bg)
        self.create_rectangle(0, r, w, h-r, fill=self._current_bg, outline=self._current_bg)
        self.create_text(w//2, h//2, text=self.text, fill=self.fg, font=self.font_spec)


class CalculatorApp(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Nova Calculator")
        self.geometry("520x760")
        self.minsize(460, 680)
        self.configure(bg=BG)

        # State
        self.expression = ""       # what the user is typing
        self.last_answer = None    # most recent successful result
        self.history = []          # list of (expression, result_str)
        self.just_evaluated = False

        self._build_layout()
        self._bind_keys()
        self._render_display()

    # ---------------- Layout ----------------
    def _build_layout(self):
        # Root grid: main (left) + history (right)
        self.columnconfigure(0, weight=3)
        self.columnconfigure(1, weight=2, minsize=180)
        self.rowconfigure(0, weight=1)

        main = tk.Frame(self, bg=BG)
        main.grid(row=0, column=0, sticky="nsew", padx=(16, 8), pady=16)
        main.rowconfigure(1, weight=1)
        main.columnconfigure(0, weight=1)

        self._build_display(main)
        self._build_keypad(main)
        self._build_history_panel()

    def _build_display(self, parent):
        panel = tk.Frame(parent, bg=PANEL, highlightthickness=0)
        panel.grid(row=0, column=0, sticky="ew", pady=(0, 12))
        panel.columnconfigure(0, weight=1)

        # Previous calculation feed (small, dim, top of panel)
        self.prev_label = tk.Label(
            panel, text="", bg=PANEL, fg=TEXT_DIM,
            font=("Segoe UI", 11), anchor="e", padx=18, pady=(14, 2),
        )
        self.prev_label.grid(row=0, column=0, sticky="ew")

        # Current expression (medium)
        self.expr_label = tk.Label(
            panel, text="", bg=PANEL, fg=TEXT_DIM,
            font=("Segoe UI", 16), anchor="e", padx=18, pady=(0, 2),
        )
        self.expr_label.grid(row=1, column=0, sticky="ew")

        # Big answer text
        self.answer_font = font.Font(family="Segoe UI", size=42, weight="bold")
        self.answer_label = tk.Label(
            panel, text="0", bg=PANEL, fg=TEXT,
            font=self.answer_font, anchor="e", padx=18, pady=(0, 18),
        )
        self.answer_label.grid(row=2, column=0, sticky="ew")

        # Thin accent underline
        underline = tk.Frame(panel, bg=ACCENT, height=2)
        underline.grid(row=3, column=0, sticky="ew", padx=18, pady=(0, 10))

    def _build_keypad(self, parent):
        pad = tk.Frame(parent, bg=BG)
        pad.grid(row=1, column=0, sticky="nsew")

        # Button grid: (text, row, col, style, action)
        rows = [
            [("AC", "fn", self.clear_all), ("DEL", "fn", self.delete_last),
             ("(",  "fn", lambda: self.insert("(")), (")",  "fn", lambda: self.insert(")"))],
            [("%",  "fn", lambda: self.insert("%")), ("^",  "op", lambda: self.insert("^")),
             ("±",  "fn", self.toggle_sign),         ("÷",  "op", lambda: self.insert("÷"))],
            [("7",  "num", lambda: self.insert("7")), ("8", "num", lambda: self.insert("8")),
             ("9",  "num", lambda: self.insert("9")), ("×", "op", lambda: self.insert("×"))],
            [("4",  "num", lambda: self.insert("4")), ("5", "num", lambda: self.insert("5")),
             ("6",  "num", lambda: self.insert("6")), ("-", "op", lambda: self.insert("-"))],
            [("1",  "num", lambda: self.insert("1")), ("2", "num", lambda: self.insert("2")),
             ("3",  "num", lambda: self.insert("3")), ("+", "op", lambda: self.insert("+"))],
            [("0",  "num", lambda: self.insert("0")), (".", "num", lambda: self.insert(".")),
             ("Ans","fn",  self.insert_answer),       ("=", "eq", self.equals)],
        ]

        for r, row in enumerate(rows):
            pad.rowconfigure(r, weight=1)
            for c, (label, kind, action) in enumerate(row):
                pad.columnconfigure(c, weight=1)
                if kind == "num":
                    bg, hv = BTN_NUM, BTN_NUM_HOV
                    fg = TEXT
                elif kind == "op":
                    bg, hv = BTN_OP, BTN_OP_HOV
                    fg = ACCENT
                elif kind == "eq":
                    bg, hv = ACCENT, ACCENT_DARK
                    fg = "#052e2b"
                else:  # fn
                    bg, hv = BTN_FN, BTN_FN_HOV
                    fg = TEXT
                btn = RoundButton(
                    pad, text=label, command=action,
                    bg=bg, hover=hv, fg=fg,
                    font_spec=("Segoe UI", 18, "bold"),
                )
                btn.grid(row=r, column=c, sticky="nsew", padx=6, pady=6)

    def _build_history_panel(self):
        side = tk.Frame(self, bg=PANEL_SOFT)
        side.grid(row=0, column=1, sticky="nsew", padx=(8, 16), pady=16)
        side.rowconfigure(1, weight=1)
        side.columnconfigure(0, weight=1)

        header = tk.Frame(side, bg=PANEL_SOFT)
        header.grid(row=0, column=0, sticky="ew", padx=12, pady=(12, 6))
        header.columnconfigure(0, weight=1)

        tk.Label(header, text="History", bg=PANEL_SOFT, fg=TEXT,
                 font=("Segoe UI", 12, "bold")).grid(row=0, column=0, sticky="w")

        clear_btn = tk.Label(header, text="Clear", bg=PANEL_SOFT, fg=DANGER,
                             font=("Segoe UI", 10, "bold"), cursor="hand2")
        clear_btn.grid(row=0, column=1, sticky="e")
        clear_btn.bind("<Button-1>", lambda e: self.clear_history())

        # Scrollable list
        canvas = tk.Canvas(side, bg=PANEL_SOFT, highlightthickness=0)
        scroll = ttk.Scrollbar(side, orient="vertical", command=canvas.yview)
        self.history_frame = tk.Frame(canvas, bg=PANEL_SOFT)

        self.history_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        canvas.create_window((0, 0), window=self.history_frame, anchor="nw", width=1)
        # Keep inner frame stretched to canvas width
        canvas.bind("<Configure>",
                    lambda e: canvas.itemconfigure("all", width=e.width))
        canvas.configure(yscrollcommand=scroll.set)

        canvas.grid(row=1, column=0, sticky="nsew", padx=(12, 0), pady=(0, 12))
        scroll.grid(row=1, column=1, sticky="ns", pady=(0, 12), padx=(0, 8))

        self.empty_history_label = tk.Label(
            self.history_frame, text="No calculations yet.",
            bg=PANEL_SOFT, fg=TEXT_DIM, font=("Segoe UI", 10), anchor="w",
        )
        self.empty_history_label.pack(fill="x", pady=6, padx=4)

    # ---------------- Keyboard ----------------
    def _bind_keys(self):
        for ch in "0123456789.+-()%^":
            self.bind(ch, lambda e, c=ch: self.insert(c))
        self.bind("*", lambda e: self.insert("×"))
        self.bind("/", lambda e: self.insert("÷"))
        self.bind("<Return>",   lambda e: self.equals())
        self.bind("<KP_Enter>", lambda e: self.equals())
        self.bind("=",          lambda e: self.equals())
        self.bind("<BackSpace>",lambda e: self.delete_last())
        self.bind("<Escape>",   lambda e: self.clear_all())

    # ---------------- Actions ----------------
    def insert(self, token: str):
        # After pressing equals, typing an operator continues from the answer,
        # while typing a digit starts a fresh expression.
        if self.just_evaluated:
            if token in "+-×÷^%)" and self.last_answer is not None:
                self.expression = format_number(self.last_answer).replace(",", "")
            else:
                self.expression = ""
            self.just_evaluated = False
        self.expression += token
        self._render_display()

    def insert_answer(self):
        if self.last_answer is not None:
            if self.just_evaluated:
                self.expression = ""
                self.just_evaluated = False
            self.expression += format_number(self.last_answer).replace(",", "")
            self._render_display()

    def delete_last(self):
        if self.just_evaluated:
            self.just_evaluated = False
            return
        self.expression = self.expression[:-1]
        self._render_display()

    def clear_all(self):
        self.expression = ""
        self.just_evaluated = False
        self.answer_label.config(text="0", fg=TEXT)
        self._render_display()

    def toggle_sign(self):
        # Wrap the current expression in a negation, or unwrap it.
        expr = self.expression.strip()
        if not expr:
            return
        if expr.startswith("-(") and expr.endswith(")"):
            self.expression = expr[2:-1]
        else:
            self.expression = f"-({expr})"
        self.just_evaluated = False
        self._render_display()

    def equals(self):
        if not self.expression.strip():
            return
        try:
            result = evaluate(self.expression)
            formatted = format_number(result)
            self._add_history(self.expression, formatted)
            self.last_answer = result
            self.answer_label.config(text=formatted, fg=TEXT)
            self._fit_answer_size(formatted)
            self.prev_label.config(text=f"{self.expression} =")
            self.expr_label.config(text="")
            self.just_evaluated = True
        except CalculatorError as e:
            self.answer_label.config(text=str(e), fg=DANGER)
            self._fit_answer_size(str(e))
        except Exception:
            self.answer_label.config(text="Error", fg=DANGER)

    # ---------------- Display helpers ----------------
    def _render_display(self):
        self.expr_label.config(text=self.expression or " ")
        if not self.just_evaluated and self.expression:
            # Show a live preview when the expression is currently valid
            try:
                preview = evaluate(self.expression)
                self.answer_label.config(text=format_number(preview), fg=TEXT_DIM)
                self._fit_answer_size(format_number(preview))
            except Exception:
                pass
        elif not self.expression:
            self.answer_label.config(text="0", fg=TEXT)
            self._fit_answer_size("0")

    def _fit_answer_size(self, text: str):
        # Shrink font as the number gets very long so it always fits.
        length = len(text)
        if length <= 10:
            size = 42
        elif length <= 14:
            size = 34
        elif length <= 20:
            size = 26
        else:
            size = 20
        self.answer_font.configure(size=size)

    # ---------------- History ----------------
    def _add_history(self, expr: str, result: str):
        self.history.append((expr, result))
        if self.empty_history_label is not None:
            self.empty_history_label.destroy()
            self.empty_history_label = None

        item = tk.Frame(self.history_frame, bg=PANEL_SOFT)
        item.pack(fill="x", padx=4, pady=4)
        tk.Label(item, text=expr, bg=PANEL_SOFT, fg=TEXT_DIM,
                 font=("Segoe UI", 9), anchor="w",
                 wraplength=180, justify="left").pack(fill="x")
        tk.Label(item, text=f"= {result}", bg=PANEL_SOFT, fg=ACCENT,
                 font=("Segoe UI", 12, "bold"), anchor="w",
                 wraplength=180, justify="left").pack(fill="x")

        # Click to reuse
        def reuse(_e, ex=expr):
            self.expression = ex
            self.just_evaluated = False
            self._render_display()
        for w in (item,) + tuple(item.winfo_children()):
            w.bind("<Button-1>", reuse)
            w.configure(cursor="hand2")

    def clear_history(self):
        self.history.clear()
        for child in self.history_frame.winfo_children():
            child.destroy()
        self.empty_history_label = tk.Label(
            self.history_frame, text="No calculations yet.",
            bg=PANEL_SOFT, fg=TEXT_DIM, font=("Segoe UI", 10), anchor="w",
        )
        self.empty_history_label.pack(fill="x", pady=6, padx=4)


if __name__ == "__main__":
    app = CalculatorApp()
    app.mainloop()
