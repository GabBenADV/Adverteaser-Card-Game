import { useState } from "react";
import Stage from "./components/scene/Stage.jsx";
import CardGrid from "./components/cards/CardGrid.jsx";

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <Stage controlsEnabled={selectedIndex === null}>
      <CardGrid selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
    </Stage>
  );
}
