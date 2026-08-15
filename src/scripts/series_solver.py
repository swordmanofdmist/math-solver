import json
import sys

from sympy import Symbol, Sum, oo
from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    standard_transformations,
    parse_expr,
)


def main():
    payload = json.loads(sys.stdin.read())
    expression = payload["expression"]
    variable_name = payload["variable"]
    start_value = payload["startValue"]

    if not variable_name.isidentifier():
        raise ValueError("The index variable must be a valid symbol name.")

    variable = Symbol(variable_name, integer=True, positive=True)
    transformations = standard_transformations + (
        convert_xor,
        implicit_multiplication_application,
    )
    local_dict = {
        variable_name: variable,
        "oo": oo,
    }

    sequence_term = parse_expr(
        expression,
        local_dict=local_dict,
        transformations=transformations,
        evaluate=True,
    )
    start = parse_expr(str(start_value), local_dict=local_dict)
    converges = Sum(sequence_term, (variable, start, oo)).is_convergent()

    print(
        json.dumps(
            {
                "converges": bool(converges),
                "result": "Converges" if converges else "Diverges",
            }
        )
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
