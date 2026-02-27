import { useEffect, useState, Suspense, use, useRef } from "react";
import Stage from "./components/scene/Stage.jsx";
import CardGrid from "./components/cards/CardGrid.jsx";
import FocusPanel from "./components/cards/FocusPanel.jsx";
import FocusTracker from "./components/scene/FocusTracker.jsx";
import IntroOverlay from "./components/ui/IntroOverlay.jsx";
import EndGame from "./components/ui/EndGame.jsx";
import solutions from "./data/solutions.json";
import Swiper from "./components/mobile/Swiper.jsx";

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [layout, setLayout] = useState("stack"); // "stack" | "scatter"
  const [activeObject, setActiveObject] = useState(null);
  const [panelPos, setPanelPos] = useState({ x: 0, y: 0 });
  const [started, setStarted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [interactions, setInteractions] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleIntroDone = () => {
    setStarted(true);
    setLayout("scatter"); // ✅ QUI parte la tua animazione di sparpagliamento (home cambia)
  };

  useEffect(() => {
    if (success) {
      selectedIndex !== null && setSelectedIndex(null);
      setActiveObject(null);
    }
  }, [success, selectedIndex]);

  const open = selectedIndex !== null;
  const item = selectedIndex !== null ? solutions[selectedIndex] : null;
  const [playsCounter, setPlaysCounter] = useState(0);

  useEffect(() => {
    if (playsCounter >= 3) {
      console.log("Hai raggiunto il limite di 3 interazioni. Non puoi più interagire con le carte.");
    }
  }, [playsCounter]);

  useEffect(() => {
    if (interactions > 0) {
      console.log(`Interazione #${interactions} con la card ${item?.title || "N/A"}`);
    }
  }, [interactions, item]);

  return (
    <div>
      {!mobile && (
        <>
          <Stage controlsEnabled={selectedIndex === null}>
            <Suspense fallback={null}>
              <CardGrid
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                layout={layout}
                setActiveObject={setActiveObject}
                canInteract={started}
                setPlaysCounter={setPlaysCounter}
                setInteractions={setInteractions}
                interactions={interactions}
              />
              {/* <FocusTracker
                enabled={open}
                target={activeObject}
                onUpdate={setPanelPos}
              /> */}
            </Suspense>
          </Stage>
          <FocusPanel
            open={open}
            item={item}
            selectedIndex={selectedIndex}
            pos={panelPos}
            delay={0.25}
            setSuccess={setSuccess}
            setPlaysCounter={setPlaysCounter}
            setActiveObject={setActiveObject}
            setSelectedIndex={setSelectedIndex}
            setInteractions={setInteractions}
            interactions={interactions}
          />
          {!started && (
            <IntroOverlay
              buttonText="gioca con noi."
              onDone={handleIntroDone}
            />
          )}
          {playsCounter >= 3 && (
            <EndGame setPlaysCounter={setPlaysCounter} setSuccess={setSuccess} />
          )}
        </>
      )}
      {success && (
        <div className="success-container">
          <button id="close" onClick={() => setSuccess(false)}>Rigioca</button>
          <div className="success-message">
            <h2 style={{ color: "white" }}>Grazie per aver giocato!</h2>
            <h2 style={{ color: "white" }}>Il nostro team ti contatterà presto.</h2>
          </div>
        </div>
      )}
      {mobile && (
        <Swiper setSuccess={setSuccess} setInteractions={setInteractions} interactions={interactions} />
      )}
    </div>
  );
}
