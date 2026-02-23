import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DIM, FOCUS, TEXTURES } from "../config/card.config.js";

export function useCardAnimation({ ref, home, isActive, isDimmed, isAnyActive }) {
  // Focus + flip (+ shift laterale in delay)
  useEffect(() => {
    const m = ref.current;
    if (!m) return;

    const width = window.innerWidth;

    gsap.killTweensOf([m.position, m.rotation, m.scale]);

    if (isActive) {
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      // focus al centro
      tl.to(m.position, { x: 0, y: 0, z: FOCUS.z, duration: FOCUS.moveDuration }, 0);

      // zoom
      tl.to(
        m.scale,
        { x: FOCUS.scale, y: FOCUS.scale, z: FOCUS.scale, duration: FOCUS.moveDuration },
        0
      );

      // raddrizza angolazione (Z=0) e flippa (Y=PI)
      tl.to(m.rotation, { z: 0, duration: FOCUS.moveDuration }, 0);
      tl.to(m.rotation, { y: Math.PI, duration: FOCUS.flipDuration }, 0.05);

      // shift “a sinistra / in alto” dopo un attimo (tu lo volevi in delay)
      const shiftAt = Math.max(0, FOCUS.moveDuration - 0.1);
      tl.to(
        m.position,
        {
          x: width < 1024 ? 0 : -1.8,
          y: width < 1024 ? 1.2 : 0,
          duration: 0.5,
          ease: "power2.in",
        },
        shiftAt
      );
    } else {
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      // torna alla home (posizione + profondità)
      // NB: qui mantengo il tuo offset z “spessore mazzo”
      tl.to(
        m.position,
        { x: home.x, y: home.y, z: home.z + 0.002 * TEXTURES.count, duration: 1.5 },
        0
      );

      // torna a scala normale
      tl.to(m.scale, { x: 1, y: 1, z: 1, duration: FOCUS.moveDuration }, 0);

      // torna fronte (y=0) e ripristina angolazione (z=home.rotZ)
      tl.to(m.rotation, { y: 0, z: home.rotZ ?? 0, duration: FOCUS.moveDuration }, 0);
    }
  }, [ref, home, isActive]);

  // Dim (restano dietro “spente”)
  const prevIsDimmed = useRef(false);

  useEffect(() => {
    const m = ref.current;
    if (!m) return;

    // la card attiva non va dimmata
    if (isActive) {
      prevIsDimmed.current = false;
      return;
    }

    const wasDimmed = prevIsDimmed.current;
    prevIsDimmed.current = isDimmed;

    // se non c’è focus attivo e questa card non è mai stata dimmata, non fare nulla
    if (!isAnyActive && !isDimmed && !wasDimmed) return;

    const targetZ = isDimmed ? DIM.z : home.z;
    const targetS = isDimmed ? DIM.scale : 1;

    gsap.to(m.position, {
      z: targetZ,
      duration: DIM.duration,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(m.scale, {
      x: targetS,
      y: targetS,
      z: targetS,
      duration: DIM.duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [ref, home, isDimmed, isActive, isAnyActive]);
}

export function hoverIn(ref, z) {
  gsap.to(ref.current.position, { z, duration: 0.2, ease: "power2.out", overwrite: "auto" });
}
export function hoverOut(ref, z) {
  gsap.to(ref.current.position, { z, duration: 0.2, ease: "power2.out", overwrite: "auto" });
}
