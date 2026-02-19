import { useMemo } from "react";
import Card from "./Card.jsx";

function rand(min, max) {
  return min + (max - min) * Math.random();
}

export default function CardGrid({ selectedIndex, setSelectedIndex, layout }) {
  const count = 32;

  const cards = useMemo(() => {
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push({
        index: i,
        scatter: [rand(-5, 5), rand(-3, 3), +0.002 * i],
        scatterRot: [rand(-0.5, 0.5) * 0.5, rand(-0.5, 0.5) * 0.6, rand(-0.5, 0.5) * 0.8],
      });
    }
    return out;
  }, []);

  return (
    <>
      {cards.map(({ index, scatter, scatterRot }) => (
        <Card
          key={index}
          index={index}
          scatterPos={scatter}
          scatterRot={scatterRot}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          layout={layout}
        />
      ))}
    </>
  );
}
