import { useMemo } from "react";
import Card from "./Card.jsx";
import { TEXTURES } from "../../config/card.config.js";

function rand(min, max) {
  return min + (max - min) * Math.random();
}

export default function CardGrid({
  selectedIndex,
  setSelectedIndex,
  canInteract,
  layout,
  setActiveObject,
}) {
  const count = TEXTURES.count; // es. 32
  const MAX_ANGLE_Z = 0.7; // ~40° (abbassa a 0.35 per ~20°)

  const cards = useMemo(() => {
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push({
        index: i,
        scatterPos: [
          rand(-5, 5),
          rand(-3, 3),
          +0.002 * i, // piccolo layering per ridurre “z fighting” e dare profondità
        ],
        angleZ: rand(-MAX_ANGLE_Z, MAX_ANGLE_Z),
      });
    }
    return out;
  }, [count]);

  return (
    <>
      {cards.map(({ index, scatterPos, angleZ }) => (
        <Card
          key={index}
          index={index}
          scatterPos={scatterPos}
          angleZ={angleZ}
          layout={layout}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          canInteract={canInteract}
          setActiveObject={setActiveObject}
        />
      ))}
    </>
  );
}
