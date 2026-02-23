import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CARD, isRetina } from "../../config/card.config";

export default function FocusPanel({ open, item, selectedIndex, pos, delay = 0.25 }) {
  const elRef = useRef(null);
  const [mounted, setMounted] = useState(open);
  const backgroundColor = (selectedIndex % 2 !== 0) ? "rgba(0,0,0,0.8)" : "rgba(84, 1, 12, 0.8)";
  const borderColor = (selectedIndex % 2 !== 0) ? "#000" : "#b60d45";
  const formRef = useRef(null);
  const cardRef = useRef(null);

  const width = window.innerWidth;

  function handleCTA() {
    // qui puoi gestire l'azione del CTA, ad esempio aprire un link o inviare un form
    const tl = gsap.timeline();
    console.log("CTA clicked for item:", item);
    if (formRef.current && cardRef.current) {
      tl.to(formRef.current, {
        autoAlpha: 1,
        zIndex: 10,
        duration: 0.5,
      })
      .to(cardRef.current, {
        autoAlpha: 0,
        duration: 0.5,
      }, -0.5);
    }
  }

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !mounted) return;

    gsap.killTweensOf(el);

    if (open) {
      setTimeout(() => {
        gsap.to(
          el,
          { autoAlpha: 1, y: "-=10", left: "+=100", duration: 1, ease: "power2.out" }
        );
      }, 2000);
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => setMounted(false),
      });
    }
  }, [open, mounted, item?.title, delay]);

  if (!mounted || !item) return null;

  return (
    <div
      ref={elRef}
      style={{
        position: "absolute",
        left: pos?.x ?? 0,
        top: pos?.y ?? 0,
        transform: "translateY(-50%)",
        width: (width < 1024) ? "80vw" : "30vw",
        padding: (isRetina) ? 64 : 32,
        background: backgroundColor,
        border: `2px solid ${borderColor}`,
        color: "#b3b3b3",
        opacity: 0,
        borderRadius: 16,
      }}
    >
      <div ref={cardRef}>
        <div style={{ fontSize: CARD.titleFontSize, fontWeight: 700, marginBottom: (isRetina) ? 60 : 30, textAlign: 'center', textTransform: 'lowercase', lineHeight: 1 }}>{item.title}</div>
        <div style={{
          opacity: 0.75, fontSize: CARD.categoryFontSize, marginBottom: 8, textAlign: 'center', textTransform: 'uppercase',
          borderTop: '1px solid #b3b3b3', borderBottom: '1px solid #b3b3b3', padding: '4px 0', margin: '20px 0'
        }}>
          {item.category}</div>
        <div style={{ fontSize: CARD.solutionFontSize, lineHeight: 1.1, opacity: 0.95, textAlign: 'center', fontWeight: 700 }}>{item.solution}</div>
        {item.cta ? (
          <div style={{
            marginTop: 20, fontSize: CARD.ctaFontSize, fontWeight: 600, opacity: 0.95, textTransform: 'uppercase', textAlign: 'center',
            border: '2px solid #b3b3b3', color: '#b3b3b3', padding: '8px 16px', borderRadius: 24, cursor: 'pointer', background: backgroundColor
          }} onClick={handleCTA}>
            {item.cta}
          </div>
        ) : null}
      </div>
      <div ref={formRef} style={{ position: "absolute", opacity: 0, visibility: "hidden", zIndex: -1, borderRadius: 16, top: 0, left: 0, width: "100%", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
       }} >
        <form action="">
          <div style={{ fontSize: CARD.solutionFontSize, lineHeight: 1.1, color: 'white', textAlign: 'center', fontWeight: 700, marginBottom: 20 }}>Lasciaci il tuo contatto</div>
          <input type="hidden" name="category" id="category" value={item.category} />
          <input style={{ border: 'white', borderRadius: 20, width: '100%', padding: '8px 12px', fontSize: 20}} type="email" name="email" id="email" placeholder="Email" />
          <button type="submit" style={{margin: '0 auto', background: 'white', color: '#b60d45', borderRadius: 20, padding: '8px 16px', marginTop: 20}}>INVIA</button>
        </form>
      </div>
    </div >
  );
}
