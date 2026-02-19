import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { TEXTURES } from "../config/card.config.js";

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function useCardTextures(index) {
  const frontUrl = useMemo(
    () => {
        return `/dist/${TEXTURES.dir}/back_${pad2(index)}.${TEXTURES.ext}`;
    },
    [index]
  );

  const backUrl = useMemo(
    () => `/dist/${TEXTURES.dir}/front_${pad2(index)}.${TEXTURES.ext}`,
    [index]
  );

  const [frontMap, backMap] = useTexture([frontUrl, backUrl]);

  // consigliato: textures “pronte” per PBR
  frontMap.colorSpace = "srgb";
  backMap.colorSpace = "srgb";
  frontMap.anisotropy = 8;
  backMap.anisotropy = 8;

  return { frontMap, backMap };
}
