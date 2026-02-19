import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { TEXTURES } from "../config/card.config.js";

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function usePreloadCardTextures() {
  const urls = useMemo(() => {
    const out = [];
    for (let i = 0; i < TEXTURES.count; i++) {
      out.push(`/dist/front_${pad2(i)}.${TEXTURES.ext}`);
      out.push(`/dist/back_${pad2(i)}.${TEXTURES.ext}`);
    }
    return out;
  }, []);

  useEffect(() => {
    useTexture.preload(urls);
  }, [urls]);
}
