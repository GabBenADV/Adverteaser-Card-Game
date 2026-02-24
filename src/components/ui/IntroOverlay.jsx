import { useRef, useState } from "react";
import gsap from "gsap";
import { CARD } from "../../config/card.config";

export default function IntroOverlay({
  onDone,
  buttonText = "Gioca",
  messageText = "Le <b>opportunità</b> si colgono meglio insieme.<br> Gli <b>imprevisti</b> non si superano con una campagna.<br>\nServono competenze, struttura, regia, allenamento continuo.<br> Serve qualcuno che giochi con te.<br>\n<h2>Scegli una carta.</h2><br> Opportunità o imprevisto, scopri come ADVERTEASER <br> rende possibile gestire entrambe le situazioni.",
  countdownFrom = 10,
}) {
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const msgRef = useRef(null);
  const counterRef = useRef(null);
  
  const [locked, setLocked] = useState(false);
  const [counter, setCounter] = useState(countdownFrom);

  const start = () => {
    if (locked) return;
    setLocked(true);

    setCounter(countdownFrom);
    //  gsap.set(counterRef.current, { autoAlpha: 0, y: -6 });
    gsap.set(msgRef.current, { autoAlpha: 0, y: 8 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => onDone?.(),
    });

    // 1) bottone svanisce
    tl.to(btnRef.current, { autoAlpha: 0, y: -6, duration: 0.25 }, 0);

    // 5) overlay sparisce subito dopo lo 0
    tl.to(wrapRef.current, { autoAlpha: 0, duration: 0.35 }, 0.25 );

    // (opzionale) blocca interazioni
    tl.set(wrapRef.current, { pointerEvents: "none" });
  };

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        backgroundImage: "url('/dist/bg-intro.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 50,
        pointerEvents: "auto",
      }}
    >
      <div style={{ textAlign: "center", color: "white" }}>
        <div
          style={{
            background: "rgba(0,0,0,0.6)",
            marginTop: 16,
            fontSize: 20,
            fontWeight: 600,
            padding: 24,
            borderRadius: 12,
            margin: "0 auto 20px",
            minWidth: "80%",
            
            height: "100%",
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ whiteSpace: "pre-line", lineHeight: 1.2 }}>
            <span dangerouslySetInnerHTML={{ __html: messageText }} />
          </div>
        </div>
        <button
          ref={btnRef}
          onClick={start}
          style={{
            padding: (window.innerWidth < 1024) ? "12px 36px" : "24px 72px",
            borderRadius: 12,
            border: "1px solid #b60d45",
            background: "#b60d45",
            color: "white",
            fontSize: CARD.titleFontSize,
            cursor: "pointer",
            animation: "pulse 1.5s ease-in-out infinite",
            zIndex: 1,
            fontWeight: 900,
            lineHeight: 1,
            position: "relative",
          }}
        >
          {buttonText}
        </button>

        
      </div>
    </div>
  );
}
