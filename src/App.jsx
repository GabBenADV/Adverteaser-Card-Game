import { useEffect, useState, Suspense } from "react";
import Stage from "./components/scene/Stage.jsx";
import CardGrid from "./components/cards/CardGrid.jsx";
import FocusPanel from "./components/cards/FocusPanel.jsx";
import FocusTracker from "./components/scene/FocusTracker.jsx";
import IntroOverlay from "./components/ui/IntroOverlay.jsx";
import solutions from "./data/solutions.json";

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [layout, setLayout] = useState("stack"); // "stack" | "scatter"
  const [activeObject, setActiveObject] = useState(null);
  const [panelPos, setPanelPos] = useState({ x: 0, y: 0 });
  const [started, setStarted] = useState(false);

  const handleIntroDone = () => {
    setStarted(true);
    setLayout("scatter"); // ✅ QUI parte la tua animazione di sparpagliamento (home cambia)
  };

  
  const open = selectedIndex !== null;
  const item = selectedIndex !== null ? solutions[selectedIndex] : null;

  // useEffect(() => {
  //   const t = setTimeout(() => setLayout("scatter"), 900);
  //   return () => clearTimeout(t);
  // }, []);

  return (
    <div>
      <Stage controlsEnabled={selectedIndex === null}>
        <Suspense fallback={null}>
          <CardGrid
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            layout={layout}
            setActiveObject={setActiveObject}
            canInteract={started}
          />
          <FocusTracker
            enabled={open}
            target={activeObject}
            onUpdate={setPanelPos}
          />
        </Suspense>
      </Stage>
      <FocusPanel open={open} item={item} selectedIndex={selectedIndex} pos={panelPos} delay={0.25} />
      {!started && (
        <IntroOverlay
          buttonText="Gioca con noi"
          onDone={handleIntroDone}
        />
      )}
    </div>
  );
}
