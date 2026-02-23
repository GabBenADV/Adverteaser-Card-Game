import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Quaternion } from "three";
import { useRef } from "react";
import { CARD } from "../../config/card.config.js";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function FocusTracker({ target, enabled, onUpdate }) {
  const { camera, size } = useThree();

  const last = useRef({ x: -99999, y: -99999 });

  // temp objects (no alloc ogni frame)
  const p = useRef(new Vector3()).current;
  const q = useRef(new Quaternion()).current;
  const right = useRef(new Vector3()).current;
  const p2 = useRef(new Vector3()).current;
  const ndc1 = useRef(new Vector3()).current;
  const ndc2 = useRef(new Vector3()).current;

  useFrame(() => {
    if (!enabled || !target) return;

    // world pos card
    target.getWorldPosition(p);
    target.getWorldQuaternion(q);

    // punto "a destra" della card in world, per calcolare offset in px
    right.set(1, 0, 0).applyQuaternion(q).multiplyScalar(CARD.size[0] / 2 + 0.15);
    p2.copy(p).add(right);

    // project -> NDC
    ndc1.copy(p).project(camera);
    ndc2.copy(p2).project(camera);

    // NDC -> px
    const x = (ndc1.x * 0.5 + 0.5) * size.width;
    const y = (-ndc1.y * 0.5 + 0.5) * size.height;

    const x2 = (ndc2.x * 0.5 + 0.5) * size.width;

    const dx = Math.abs(x2 - x);
    let panelX = x + dx + 16; // 16px gap a destra
    let panelY = y;

    // clamp viewport (lascia un po’ di margine)
    panelX = clamp(panelX, 16, size.width - 16);
    panelY = clamp(panelY, 16, size.height - 16);

    // evita setState spam
    if (Math.abs(panelX - last.current.x) < 0.5 && Math.abs(panelY - last.current.y) < 0.5) return;
    last.current = { x: panelX, y: panelY };

    onUpdate({ x: panelX, y: panelY });
  });

  return null;
}
