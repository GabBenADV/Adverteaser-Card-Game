import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { TEXTURES } from "../config/card.config.js";
import * as THREE from "three";

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
    () => `/dist/${TEXTURES.dir}/front-x/front_${pad2(index)}.png`,
    [index]
  );

  const [frontMap, backMap] = useTexture([frontUrl, backUrl]);

  // consigliato: textures “pronte” per PBR
  frontMap.colorSpace = THREE.SRGBColorSpace;
  backMap.colorSpace  = THREE.SRGBColorSpace;

  // migliora tantissimo a texture oblique
  frontMap.anisotropy = 16;
  backMap.anisotropy  = 16;

  // evita blur eccessivo se la texture è già “soft”
  frontMap.minFilter = THREE.LinearMipmapLinearFilter;
  frontMap.magFilter = THREE.LinearFilter;
  backMap.minFilter  = THREE.LinearMipmapLinearFilter;
  backMap.magFilter  = THREE.LinearFilter;

  // se stai usando webp/jpg, lascia mipmaps true (default)
  frontMap.generateMipmaps = true;
  backMap.generateMipmaps = true;

  // IMPORTANT: dopo modifiche
  // frontMap.needsUpdate = true;
  // backMap.needsUpdate = true;

  return { frontMap, backMap };
}
