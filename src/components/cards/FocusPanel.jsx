import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CARD, isRetina } from "../../config/card.config";
import useCardForm from '../../hooks/useCardForm';

export default function FocusPanel({ open, item, selectedIndex, pos, delay = 0.25 }) {
  const elRef = useRef(null);
  const [mounted, setMounted] = useState(open);
  const backgroundColor = (selectedIndex % 2 !== 0) ? "rgba(0,0,0,0.8)" : "rgba(84, 1, 12, 0.8)";
  const borderColor = (selectedIndex % 2 !== 0) ? "#000" : "#b60d45";
  const formRef = useRef(null);
  const cardRef = useRef(null);
  const { submitForm, handleCTA } = useCardForm(formRef, cardRef, item);

  const width = window.innerWidth;

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !mounted) return;
    gsap.killTweensOf(el);

    if (open) {
      setTimeout(() => {
        gsap.to( el, { autoAlpha: 1, y: "-=10", left: "+=100", duration: 1, ease: "power2.out" } ); }
      , 2000);
    } else {
      gsap.to(el, { autoAlpha: 0, duration: 0.2, ease: "power2.out", onComplete: () => setMounted(false), });
    }
  }, [open, mounted, item?.title, delay]);

  if (!mounted || !item) return null;

  return (
    <div className="card-container" ref={elRef}
      style={{ position: "absolute", left: pos?.x ?? 0, top: pos?.y ?? 0, transform: "translateY(-50%)", width: (width < 1024) ? "80vw" : "30vw",
      padding: (isRetina) ? 64 : 32, background: backgroundColor, border: `2px solid ${borderColor}`, color: "#b3b3b3", opacity: 0, borderRadius: 16, }}>
      <div ref={cardRef}>
        <div className="card-title" style={{ fontSize: CARD.titleFontSize, marginBottom: (isRetina) ? 60 : 30}}>{item.title}</div>
        <div className="card-category" style={{ fontSize: CARD.categoryFontSize }}>{item.category}</div>
        <div className="card-solution" style={{ fontSize: CARD.solutionFontSize }}>{item.solution}</div>
        { item.cta ? ( <div className="card-cta" style={{ fontSize: CARD.ctaFontSize, background: backgroundColor }} onClick={handleCTA}>{item.cta}</div> ) : null }
      </div>
      <div className="game-contact-form-container" ref={formRef} >
        <form className="game-contact-form" action="" onSubmit={(e) => { submitForm(e); }} >
          <div className="form-title" style={{ fontSize: CARD.solutionFontSize }}>Lasciaci il tuo contatto</div>
          <input type="hidden" name="category" id="category" value={item.category} />
          <input type="email" name="email" id="email" placeholder="Email" />
          <button type="submit" className="game-contact-form-submit">INVIA</button>
        </form>
      </div>
    </div>
  );
}
