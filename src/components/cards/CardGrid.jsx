import Card from "./Card.jsx";
import { useCardGrid } from "../../hooks/useCardGrid.js";

export default function CardGrid({ selectedIndex, setSelectedIndex }) {
  const cards = useCardGrid();

  return (
    <>
      {cards.map(({ index, position }) => (
        <Card
          key={index}
          index={index}
          position={position}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      ))}
    </>
  );
}
