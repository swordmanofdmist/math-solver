import { spawn } from "child_process";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

type SeriesResponse = {
  result?: string;
  converges?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SeriesResponse>,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST requests are allowed." });
    return;
  }

  const { expression, variable, startValue } = req.body as {
    expression?: string;
    variable?: string;
    startValue?: string;
  };

  if (!expression || !variable || !startValue) {
    res.status(400).json({
      error: "Expression, variable, and start value are required.",
    });
    return;
  }

  const scriptPath = path.join(process.cwd(), "src", "scripts", "series_solver.py");
  const pythonPath = path.join(process.cwd(), ".python-libs");
  const python = spawn("python", [scriptPath], {
    env: {
      ...process.env,
      PYTHONPATH: pythonPath,
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";

  python.stdout.on("data", (chunk: Buffer) => {
    stdout += chunk.toString();
  });

  python.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });

  python.stdin.write(JSON.stringify({ expression, variable, startValue }));
  python.stdin.end();

  python.on("close", (code) => {
    if (code !== 0) {
      res.status(500).json({
        error: stderr.trim() || "Could not analyze the series.",
      });
      return;
    }

    try {
      const data = JSON.parse(stdout) as SeriesResponse;
      res.status(200).json(data);
    } catch {
      res.status(500).json({ error: "Could not parse the SymPy result." });
    }
  });
}
