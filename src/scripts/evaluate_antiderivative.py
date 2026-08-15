import json
import sys

from sympy import Symbol, simplify
from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    standard_transformations,
    parse_expr,
)


def main():
    payload = json.loads(sys.stdin.read())
    expression = payload["expression"].replace(" + C", "").replace("+ C", "")
    variable_name = payload["variable"]
    lower_bound = payload["lowerBound"]
    upper_bound = payload["upperBound"]

    if not variable_name.isidentifier():
        raise ValueError("The variable must be a valid symbol name.")

    variable = Symbol(variable_name)
    transformations = standard_transformations + (
        convert_xor,
        implicit_multiplication_application,
    )
    local_dict = {variable_name: variable}

    antiderivative = parse_expr(
        expression,
        local_dict=local_dict,
        transformations=transformations,
        evaluate=True,
    )
    lower = parse_expr(str(lower_bound), local_dict=local_dict)
    upper = parse_expr(str(upper_bound), local_dict=local_dict)
    value = simplify(antiderivative.subs(variable, upper) - antiderivative.subs(variable, lower))

    print(json.dumps({"result": str(value)}))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
