// @refresh reset
import { useEffect, useId, useRef } from "react";

const symbols = [
  {
    tool: "chalk",
    example: "d/dx (x²) = 2x",
    formulaViewBox: "-90 140 275 120",
    paths: [
      "M 83 27 C 66 19 49 40 57 52 C 67 65 83 42 87 12 L 78 53",
      "M 43 73 L 120 73",
      "M 68 106 C 52 98 39 116 45 129 C 53 141 69 121 74 92 L 65 132",
      "M 87 105 C 94 103 99 115 108 132",
      "M 110 104 C 103 116 94 128 85 133",
    ],
    formulaPaths: [
      "M -42 181 C -52 176 -59 186 -55 192 C -49 199 -40 185 -38 173 L -42 193",
      "M -65 200 L -27 200",
      "M -50 212 C -60 208 -64 220 -58 223 C -51 227 -46 214 -45 207 L -49 224",
      "M -38 213 L -29 224",
      "M -29 213 L -39 224",
      "M -6 183 Q -17 199 -6 215",
      "M 2 190 C 8 188 12 197 20 208",
      "M 20 190 L 1 209",
      "M 22 179 C 24 171 34 173 33 179 Q 32 182 22 187 L 34 187",
      "M 41 183 Q 52 199 41 215",
      "M 63 194 L 83 194",
      "M 63 202 L 83 202",
      "M 101 190 C 104 179 125 181 121 192 Q 117 199 101 210 L 124 210",
      "M 135 190 C 141 188 145 198 153 210",
      "M 154 190 L 134 210",
    ],
  },
  {
    tool: "pencil",
    example: "∫ 2x dx = x² + C",
    formulaViewBox: "-95 140 310 120",
    paths: [
      "M 108 20 C 82 -1 81 36 77 73 C 73 112 74 153 49 132",
    ],
    formulaPaths: [
      "M -54 178 C -68 168 -65 190 -69 207 Q -72 221 -79 214",
      "M -45 190 C -42 180 -25 180 -27 191 Q -30 199 -46 209 L -26 209",
      "M -17 190 C -12 188 -8 198 -1 209",
      "M 0 190 L -18 209",
      "M 23 191 C 12 185 6 198 12 206 C 19 215 28 191 29 179 L 23 208",
      "M 36 190 C 41 188 45 198 52 209",
      "M 54 190 L 35 209",
      "M 66 194 L 84 194",
      "M 66 202 L 84 202",
      "M 98 190 C 103 188 108 198 115 209",
      "M 116 190 L 97 209",
      "M 117 179 C 119 171 129 172 128 179 Q 127 183 117 187 L 129 187",
      "M 140 198 L 160 198",
      "M 150 188 L 150 208",
      "M 196 185 C 177 175 170 193 175 205 Q 180 216 194 207",
    ],
  },
  {
    tool: "marker",
    example: "Sum of n from n = 1 to 3 equals 6",
    formulaViewBox: "-45 140 195 120",
    paths: ["M 115 27 L 48 27 L 85 75 L 48 124 L 115 124"],
    formulaPaths: [
      "M 9 187 L -18 187 L -2 201 L -18 215 L 9 215",
      "M -10 170 C -4 165 3 169 -2 173 C 7 173 3 182 -5 180",
      "M -24 223 L -25 232 C -23 222 -17 221 -18 232",
      "M -13 225 L -6 225",
      "M -13 229 L -6 229",
      "M -1 225 L 3 222 L 2 232",
      "M 33 190 L 30 210 C 34 190 50 183 46 198 L 43 210",
      "M 66 194 L 85 194",
      "M 66 202 L 85 202",
      "M 120 184 C 101 176 98 214 112 212 C 128 210 122 188 105 199",
    ],
  },
] as const;

export default function AnimatedOperationSymbol({ index }: { index: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textureId = useId();
  const symbol = symbols[index];

  useEffect(() => {
    const svg = svgRef.current;
    const button = svg?.closest("a");
    if (!svg || !button) return;

    const strokes = Array.from(svg.querySelectorAll<SVGPathElement>(".formula-stroke"));
    const tool = svg.querySelector<SVGGElement>(".symbol-writing-tool");
    const idleSymbol = svg.querySelector<SVGGElement>(".symbol-idle");
    const formula = svg.querySelector<SVGGElement>(".symbol-formula");
    if (!tool || !idleSymbol || !formula) return;

    let frame = 0;

    function reset() {
      cancelAnimationFrame(frame);
      strokes.forEach((stroke) => {
        stroke.style.strokeDasharray = "none";
        stroke.style.strokeDashoffset = "0";
        stroke.style.visibility = "visible";
      });
      tool!.style.opacity = "0";
      idleSymbol!.style.display = "";
      formula!.style.display = "";
      svg!.setAttribute("viewBox", "0 0 160 160");
    }

    function draw() {
      reset();
      idleSymbol!.style.display = "none";
      formula!.style.display = "block";
      svg!.setAttribute("viewBox", symbol.formulaViewBox);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Measure after showing the formula so hidden SVG geometry is never used.
      const lengths = strokes.map((stroke) => stroke.getTotalLength());
      const totalLength = lengths.reduce((sum, length) => sum + length, 0);
      strokes.forEach((stroke, i) => {
        stroke.style.strokeDasharray = `${lengths[i]} ${lengths[i]}`;
        stroke.style.strokeDashoffset = `${lengths[i]}`;
        stroke.style.visibility = "hidden";
      });
      let started: number | undefined;
      // Keep the tool the same visual size across the differently sized formulas.
      const toolScale = Number(symbol.formulaViewBox.split(" ")[2]) / 340;

      function tick(now: number) {
        started ??= now;
        const progress = Math.min((now - started) / 2400, 1);
        let remaining = progress * totalLength;
        let active = 0;
        let distance = 0;

        strokes.forEach((stroke, i) => {
          const drawn = Math.max(0, Math.min(remaining, lengths[i]));
          stroke.style.strokeDashoffset = `${lengths[i] - drawn}`;
          stroke.style.visibility = drawn > 0 ? "visible" : "hidden";
          if (remaining >= 0) {
            active = i;
            distance = drawn;
          }
          remaining -= lengths[i];
        });

        const point = strokes[active].getPointAtLength(distance);
        tool!.setAttribute(
          "transform",
          `translate(${point.x} ${point.y}) rotate(30) scale(${toolScale})`,
        );
        tool!.style.opacity = progress < 1 ? "1" : "0";
        if (progress < 1) frame = requestAnimationFrame(tick);
        else strokes.forEach((stroke) => {
          stroke.style.strokeDasharray = "none";
          stroke.style.strokeDashoffset = "0";
          stroke.style.visibility = "visible";
        });
      }

      frame = requestAnimationFrame(tick);
    }

    function leave() {
      if (!button!.matches(":focus-visible")) reset();
    }

    function blur() {
      if (!button!.matches(":hover")) reset();
    }

    function focus() {
      if (button!.matches(":focus-visible") && !button!.matches(":hover")) draw();
    }

    button.addEventListener("pointerenter", draw);
    button.addEventListener("pointerleave", leave);
    button.addEventListener("focus", focus);
    button.addEventListener("blur", blur);
    return () => {
      reset();
      button.removeEventListener("pointerenter", draw);
      button.removeEventListener("pointerleave", leave);
      button.removeEventListener("focus", focus);
      button.removeEventListener("blur", blur);
    };
  }, [symbol.formulaViewBox]);

  return (
    <svg
      ref={svgRef}
      className={`operation-symbol-drawing operation-symbol-${symbol.tool}`}
      viewBox="0 0 160 160"
      aria-hidden="true"
      focusable="false"
    >
      <title>{symbol.example}</title>
      {symbol.tool === "chalk" && (
        <defs>
          <filter id={textureId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="8" />
            <feDisplacementMap in="SourceGraphic" scale="0.8" />
          </filter>
        </defs>
      )}
      <g filter={symbol.tool === "chalk" ? `url(#${textureId})` : undefined}>
        <g className="symbol-idle">
          {symbol.paths.map((path) => (
            <path className="symbol-stroke" key={path} d={path} />
          ))}
        </g>
        <g className="symbol-formula">
          {symbol.formulaPaths.map((path) => (
            <path className="symbol-stroke formula-stroke" key={path} d={path} />
          ))}
        </g>
      </g>
      <g className="symbol-writing-tool">
        {symbol.tool === "chalk" ? (
          <>
            <rect x="-5" y="-33" width="10" height="32" rx="3" fill="#fffdf8" />
            <path d="M -2 -28 L -2 -8" stroke="#d8d0c0" strokeWidth="2" />
          </>
        ) : symbol.tool === "pencil" ? (
          <>
            <path d="M 0 0 L -5 -13 L 5 -13 Z" fill="#e8c598" />
            <path d="M 0 0 L -2 -5 L 2 -5 Z" fill="#24201e" />
            <rect x="-5" y="-49" width="10" height="36" fill="#edbd48" />
            <path d="M 1 -46 L 1 -14" stroke="#bf8526" strokeWidth="2" />
            <rect x="-5" y="-54" width="10" height="7" rx="2" fill="#dc9e95" />
            <path d="M -5 -47 L 5 -47" stroke="#c5ccd0" strokeWidth="4" />
          </>
        ) : (
          <>
            <path d="M -3 -2 L 3 0 L 4 -10 L -3 -10 Z" fill="#163d75" />
            <path d="M -4 -9 L 4 -9 L 6 -17 L -6 -17 Z" fill="#252c34" />
            <rect x="-7" y="-51" width="14" height="35" rx="3" fill="#f0f2f3" />
            <path d="M -3 -46 L -3 -23" stroke="#ffffff" strokeWidth="2" />
            <rect x="-7" y="-39" width="14" height="10" fill="#163d75" />
            <rect x="-7" y="-58" width="14" height="10" rx="3" fill="#163d75" />
          </>
        )}
      </g>
    </svg>
  );
}
