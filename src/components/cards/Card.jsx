import { useEffect, useMemo, useRef } from "react";
import { CARD, DIM, FOCUS } from "../../config/card.config.js";
import { useCardAnimation, hoverIn, hoverOut } from "../../hooks/useCardAnimation.js";
import { useCardTextures } from "../../hooks/useCardTextures.js";
import { trackInteraction } from "../../utils/trackInteraction.js";
import { getSessionId } from "../../utils/sessionId.js";
import solutions from "../../data/solutions.json";
import { set } from "react-hook-form";

export default function Card({
  index,
  scatterPos,
  angleZ,
  layout,
  selectedIndex,
  setSelectedIndex,
  canInteract = true,
  setActiveObject,
  setPlaysCounter,
  setInteractions,
  interactions
}) {
  const ref = useRef();

  const sessionId = getSessionId();
  const isActive = selectedIndex === index;
  const isAnyActive = selectedIndex !== null;
  const isDimmed = isAnyActive && !isActive;

  const { frontMap, backMap } = useCardTextures(index);

  // stack: piccolo “mucchio” con spessore
  const stackPos = useMemo(() => {
    const z = +0.002 * index;
    const x = 0.01 * index - 0.1;
    return [x, 0, z];
  }, [index]);

  // home “dinamica” in base al layout + rotZ (angolazione 2D)
  const home = useMemo(() => {
    const p = layout === "stack" ? stackPos : scatterPos;
    return {
      x: p[0],
      y: p[1],
      z: p[2] ?? 0,
      rotZ: layout === "scatter" ? angleZ : 0,
    };
  }, [layout, stackPos, scatterPos, angleZ]);

  // posizione/rotazione iniziale fissate (React non deve teletrasportare ad ogni render)
  const initialPos = useRef(null);
  if (!initialPos.current) initialPos.current = [home.x, home.y, home.z];

  const initialRot = useRef(null);
  if (!initialRot.current) initialRot.current = [0, 0, home.rotZ ?? 0];

  useCardAnimation({ ref, home, isActive, isDimmed, isAnyActive });

  // opzionale: esponi l’oggetto attivo (se ti serve per panel esterno)
  useEffect(() => {
    if (!setActiveObject) return;
    if (isActive) setActiveObject(ref.current);
    else if (!isAnyActive) setActiveObject(null);
  }, [isActive, isAnyActive, setActiveObject]);

  const onPointerDown = (e) => {
    if (!canInteract) return;

    // reagisce SOLO il primo hit (quello davanti)
    if (e.intersections?.[0]?.eventObject !== e.eventObject) return;

    e.stopPropagation();

    if (isAnyActive && !isActive) return;

    setSelectedIndex((cur) => {
      if(cur === index) {
        setPlaysCounter((prev) => prev += 1);
        trackInteraction({
          session_id: sessionId, 
          card_index: index, 
          step: interactions,
          device: 'desktop',
          category: solutions[index].category,
          card_type: (index % 2 === 0) ? "opportunita" : "imprevisto",
          completed: 0
        });
        setInteractions(0);
        return null;
      } 
      else {
        setInteractions(1);
        return index
      };
    });
  };

  return (
    <mesh
      ref={ref}
      position={initialPos.current}
      rotation={initialRot.current}
      onPointerDown={onPointerDown}
      castShadow
      receiveShadow
    >
      <boxGeometry args={CARD.size} />

      {Array.from({ length: 6 }).map((_, i) => (
        <meshStandardMaterial
          key={i}
          attach={`material-${i}`}
          metalness={0}
          roughness={1}
          map={i === 4 ? frontMap : i === 5 ? backMap : null}
          transparent={isDimmed}
          opacity={isDimmed ? DIM.opacity : 1}
          depthWrite={!isDimmed}
        />
      ))}
    </mesh>
  );
}
