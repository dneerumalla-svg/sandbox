"""
calculator_logic.py
-------------------
Pure calculation logic for the calculator app.

This file is intentionally free of any GUI code so it can be:
- Unit tested easily
- Reused by another interface (CLI, web, etc.)
- Understood on its own by a beginner
"""

import ast
import operator as op

# Map AST operator nodes to real Python operator functions.
# Using AST instead of eval() means we ONLY allow the math we want.
# This is much safer than eval("...") on raw user input.
_ALLOWED_BINOPS = {
    ast.Add: op.add,
    ast.Sub: op.sub,
    ast.Mult: op.mul,
    ast.Div: op.truediv,
    ast.Mod: op.mod,
    ast.Pow: op.pow,
    ast.FloorDiv: op.floordiv,
}

_ALLOWED_UNARYOPS = {
    ast.UAdd: op.pos,
    ast.USub: op.neg,
}


class CalculatorError(Exception):
    """Raised when an expression cannot be evaluated."""


def _eval_node(node):
    """Recursively evaluate a parsed AST node."""
    # A plain number literal, e.g. 3 or 3.14
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise CalculatorError("Only numbers are allowed")

    # Binary operations: a + b, a * b, a ** b, ...
    if isinstance(node, ast.BinOp):
        left = _eval_node(node.left)
        right = _eval_node(node.right)
        func = _ALLOWED_BINOPS.get(type(node.op))
        if func is None:
            raise CalculatorError("Operator not allowed")
        try:
            return func(left, right)
        except ZeroDivisionError:
            raise CalculatorError("Cannot divide by zero")

    # Unary operations: -x, +x
    if isinstance(node, ast.UnaryOp):
        operand = _eval_node(node.operand)
        func = _ALLOWED_UNARYOPS.get(type(node.op))
        if func is None:
            raise CalculatorError("Unary operator not allowed")
        return func(operand)

    # Parentheses are handled implicitly by the AST tree structure.
    raise CalculatorError("Invalid expression")


def normalize_expression(expression: str) -> str:
    """
    Convert user-friendly symbols to Python-friendly ones.

    - '×' becomes '*'
    - '÷' becomes '/'
    - '^' becomes '**' (exponent)
    - '%' becomes '/100' so "50%" means 0.5
    """
    expr = expression.strip()
    if not expr:
        raise CalculatorError("Empty expression")

    expr = expr.replace("×", "*").replace("÷", "/")
    expr = expr.replace("^", "**")

    # Replace percent sign: "50%" -> "(50/100)"
    # This handles simple cases like "200 + 10%" as 200 + 0.1
    # which is a common calculator convention.
    result = []
    i = 0
    while i < len(expr):
        ch = expr[i]
        if ch == "%":
            result.append("/100")
        else:
            result.append(ch)
        i += 1
    return "".join(result)


def evaluate(expression: str):
    """
    Safely evaluate a math expression string and return a number.

    Raises CalculatorError with a friendly message on any failure.
    """
    normalized = normalize_expression(expression)
    try:
        tree = ast.parse(normalized, mode="eval")
    except SyntaxError:
        raise CalculatorError("Invalid expression")

    result = _eval_node(tree.body)

    # Convert floats that are actually whole numbers to int for cleaner display
    if isinstance(result, float) and result.is_integer():
        result = int(result)
    return result


def format_number(value) -> str:
    """
    Format a number for display:
    - Thousands separators for readability
    - Trim trailing zeros on floats
    - Fall back to scientific notation for very large / very small numbers
    """
    if isinstance(value, int):
        return f"{value:,}"

    if isinstance(value, float):
        abs_v = abs(value)
        if abs_v != 0 and (abs_v >= 1e16 or abs_v < 1e-6):
            return f"{value:.6e}"
        # Up to 10 decimal places, then strip trailing zeros
        text = f"{value:,.10f}".rstrip("0").rstrip(".")
        return text or "0"

    return str(value)
