import { useMemo } from "react";
import { GRID } from "../config/card.config.js";

export function useCardGrid() {
  const { cols, rows, gapX, gapY } = GRID;

  return useMemo(() => {
    const out = [];
    const startX = -((cols - 1) * gapX) / 2;
    const startY = ((rows - 1) * gapY) / 2;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          index: idx++,
          position: [startX + c * gapX, startY - r * gapY, 0],
        });
      }
    }
    return out;
  }, [cols, rows, gapX, gapY]);
}
