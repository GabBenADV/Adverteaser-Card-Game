import { useEffect, useState, Suspense } from "react";
import Stage from "./components/scene/Stage.jsx";
import CardGrid from "./components/cards/CardGrid.jsx";

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [layout, setLayout] = useState("stack"); // "stack" | "scatter"

  useEffect(() => {
    const t = setTimeout(() => setLayout("scatter"), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <Stage controlsEnabled={selectedIndex === null}>
      <Suspense fallback={null}>
        <CardGrid
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          layout={layout}
        />
      </Suspense>
    </Stage>
  );
}
