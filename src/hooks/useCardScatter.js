import { useMemo } from "react";
import { TEXTURES } from "../config/card.config.js";

// RNG deterministico (mulberry32)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randRange(rng, min, max) {
  return min + (max - min) * rng();
}

export function useCardScatter({
  count = TEXTURES.count,
  seed = 1234,
  bounds = { x: 4, y: 2.5, z: 1 },
  rotation = { x: 0, y: 0, z: 0.35 }, // ~20°
} = {}) {
  return useMemo(() => {
    const rng = Math.random; // per default, se seed è null o undefined, usa il random normale

    const out = [];
    for (let i = 0; i < count; i++) {
      out.push({
        index: i,
        position: [
          randRange(rng, -bounds.x, bounds.x),
          randRange(rng, -bounds.y, bounds.y),
          randRange(rng, -bounds.z, bounds.z),
        ],
        // se in futuro vuoi usarla: rotazione home
        homeRotation: [
          randRange(rng, -rotation.x, rotation.x),
          randRange(rng, -rotation.y, rotation.y),
          randRange(rng, -rotation.z, rotation.z),
        ],
      });
    }
    return out;
  }, [count, seed, bounds.x, bounds.y, bounds.z, rotation.x, rotation.y, rotation.z]);
}
