"""
main.py
-------
Entry point. Run this file to launch the calculator:

    python main.py
"""

from calculator_ui import CalculatorApp


def main():
    app = CalculatorApp()
    app.mainloop()


if __name__ == "__main__":
    main()
