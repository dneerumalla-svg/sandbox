# Nova Calculator

A modern desktop calculator built with Python + Tkinter.

## How to run

1. Install Python 3.9 or newer. Tkinter ships with the standard Python installer on Windows and macOS. On Linux you may need `sudo apt install python3-tk`.
2. Open a terminal in the `calculator/` folder.
3. Run:

   ```bash
   python main.py
   ```

No third-party packages are required.

## Files

- **`main.py`** — Entry point. Creates the app window and starts the Tk main loop.
- **`calculator_ui.py`** — All the graphical interface code: the dark display panel, rounded buttons, keypad grid, scrollable history sidebar, and keyboard shortcuts.
- **`calculator_logic.py`** — Pure calculation engine. Parses expressions with Python's `ast` module (safer than `eval`) and formats numbers for display.
- **`README.md`** — This file.

Separating logic from UI means you could reuse `calculator_logic.py` in a web app or CLI without changing a single line of it.

## How the calculator logic works

1. The user's expression string (e.g. `50 + 10%`) is first **normalized**: `×` → `*`, `÷` → `/`, `^` → `**`, and `%` → `/100`.
2. The normalized string is parsed by `ast.parse(expr, mode="eval")`. This turns it into a tree of nodes (numbers, binary ops, unary ops) — but it does **not** run the code.
3. `_eval_node` walks that tree recursively. It only permits a small whitelist of node types (numbers, `+ - * / % **`, unary `+/-`), so a user can't sneak in function calls, attribute access, or anything else. This gives us proper PEMDAS for free, because the AST already encodes operator precedence and parentheses.
4. Division by zero and syntax errors are caught and re-raised as `CalculatorError` with a friendly message, which the UI shows in red instead of crashing.
5. `format_number` adds thousands separators, trims trailing zeros on floats, and falls back to scientific notation for extreme values.

## How the UI was built

- The window is a `tk.Tk` with a two-column grid: keypad on the left, history sidebar on the right.
- The **display** is a `Frame` containing three stacked labels (previous calculation, current expression, big answer) plus a thin accent underline.
- **Buttons** are a custom `RoundButton` class that draws a rounded rectangle on a `Canvas`, because native `tk.Button` can't do rounded corners consistently across platforms. Hover and press states change the fill color.
- The **history panel** is a `Canvas` + `Frame` combo with a `ttk.Scrollbar` — the standard Tk trick for a scrollable list of widgets. Each entry is clickable to reuse the expression.
- **Keyboard support** is wired up in `_bind_keys`: digits, operators, Enter, Backspace, and Escape all map to the equivalent button.
- **Auto-shrinking text**: `_fit_answer_size` reduces the answer font when a number gets long so it always fits inside the panel.
- **Live preview**: as you type a valid expression, the answer area shows a dim preview of the result before you press `=`.

## Adding features later

Some easy next steps:

- **Scientific functions** (sin, cos, log, sqrt): extend `_ALLOWED_BINOPS` / add a whitelist of `ast.Call` names in `calculator_logic.py`, then add buttons in `_build_keypad`.
- **Memory keys (M+, M-, MR)**: add a `self.memory` variable in `CalculatorApp` and three buttons that read/write it.
- **Themes**: move the color palette at the top of `calculator_ui.py` into a dict and add a toggle button that swaps between "dark" and "light" versions.
- **Persistent history**: on `equals`, append to a JSON file; load it on startup.
- **Unit conversions**: add a second tab using `ttk.Notebook` that reuses the same display but a different keypad.

Because logic and UI are separate files, most of these changes touch only one of them.
