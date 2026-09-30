import io
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch


PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.dont_write_bytecode = True
sys.path.insert(0, str(PROJECT_ROOT / ".python-libs"))
sys.path.insert(0, str(PROJECT_ROOT / "src" / "scripts"))

from series_solver import main


class SeriesSolverTests(unittest.TestCase):
    def solve(self, expression, variable="n", start_value="1"):
        output = io.StringIO()
        payload = {
            "expression": expression,
            "variable": variable,
            "startValue": start_value,
        }

        with patch("sys.stdin", io.StringIO(json.dumps(payload))), patch(
            "sys.stdout", output
        ):
            main()

        return json.loads(output.getvalue())

    def test_p_series_with_exponent_notation_converges(self):
        self.assertEqual(
            self.solve("1/n^2"),
            {"converges": True, "result": "Converges"},
        )

    def test_harmonic_series_diverges(self):
        self.assertEqual(
            self.solve("1/n"),
            {"converges": False, "result": "Diverges"},
        )

    def test_geometric_series_converges(self):
        self.assertEqual(
            self.solve("1/2^n"),
            {"converges": True, "result": "Converges"},
        )

    def test_supports_a_custom_index_and_start_value(self):
        self.assertEqual(
            self.solve("1/k^2", variable="k", start_value="3"),
            {"converges": True, "result": "Converges"},
        )

    def test_rejects_an_invalid_index_name(self):
        with self.assertRaisesRegex(ValueError, "valid symbol name"):
            self.solve("1/n", variable="n + 1")


if __name__ == "__main__":
    unittest.main()
