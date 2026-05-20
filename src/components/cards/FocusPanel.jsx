import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CARD, isRetina } from "../../config/card.config";
import useCardForm from '../../hooks/useCardForm';
import { isRecaptchaEnabled } from "../../config/recaptcha.config";
import Recaptcha from "../ui/Recaptcha";

export default function FocusPanel({ open, item, selectedIndex, delay = 0.25, setSuccess, setPlaysCounter, setInteractions, interactions }) {
    const elRef = useRef(null);
    const [mounted, setMounted] = useState(open);
    const backgroundColor = (selectedIndex % 2 !== 0) ? "rgba(0,0,0,0.8)" : "rgba(84, 1, 12, 0.8)";
    const formRef = useRef(null);
    const cardRef = useRef(null);
    const [error, setError] = useState(null);
    const {
        register,
        onSubmit,
        isSubmitting,
        handleCTA,
        setRecaptchaToken,
        recaptchaResetKey,
        recaptchaRules,
    } = useCardForm(formRef, cardRef, item, setSuccess, setPlaysCounter, setError, setInteractions, interactions, selectedIndex);

    useEffect(() => {
        if (!open) return;

        const frame = window.requestAnimationFrame(() => setMounted(true));
        return () => window.cancelAnimationFrame(frame);
    }, [open]);

    useEffect(() => {
        const el = elRef.current;
        if (!el || !mounted) return;
        gsap.killTweensOf(el);

        if (open) {
            setTimeout(() => {
                gsap.to(el, { autoAlpha: 1, right: 0, duration: 1, ease: "power2.out" });
            }, 1000);
        } else {
            gsap.to(el, { autoAlpha: 0, duration: 0.2, ease: "power2.out", onComplete: () => setMounted(false), });
        }
    }, [open, mounted, item?.title, delay]);

    if (!mounted || !item) return null;

    return (
        <div className="card-container" ref={elRef}
            style={{
                position: "absolute", right: "-100%", top: '10vh', width: '40vw', height: `80vh`,
                padding: (isRetina) ? '128px 64px' : '64px 32px', background: backgroundColor, color: "#b3b3b3", opacity: 0, display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
            <div className="card-content" ref={cardRef} style={{ gap: (isRetina) ? 72 : 36 }} >
                <div className="card-title" style={{ fontSize: CARD.titleFontSize, gap: (isRetina) ? 60 : 30 }}>{item.cta}</div>
                {/* <div className="card-category" style={{ fontSize: CARD.categoryFontSize }}>{item.category}</div> */}
                <div className="card-solution" style={{ fontSize: CARD.solutionFontSize }}>{item.solution}</div>
                {item.cta ? (<div className="card-cta" style={{ fontSize: CARD.categoryFontSize }} onClick={handleCTA}>Clicca qui</div>) : null}
            </div>
            <div className="game-contact-form-container" ref={formRef} >
                <form className="game-contact-form" action="" onSubmit={onSubmit} >
                    <div className="form-title" style={{ fontSize: CARD.solutionFontSize }}>Lasciaci il tuo contatto</div>
                    <input type="hidden" id="category" {...register("category", { required: "Categoria mancante" })} />
                    <input type="text" name="name" id="name" placeholder="Nome e Cognome" {...register("name", { required: "Inserisci nome e cognome" })} />
                    <input type="email" name="email" id="email" placeholder="Email"
                        {...register("email", {
                            required: "Inserisci una email",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email non valida",
                            },
                        })} />
                    {isRecaptchaEnabled && (
                        <>
                            <input type="hidden" {...register("recaptchaToken", recaptchaRules)} />
                            <Recaptcha
                                onVerify={setRecaptchaToken}
                                resetKey={recaptchaResetKey}
                            />
                        </>
                    )}
                    {error && <div className="form-error">{error}</div>}
                    
                    <button type="submit" className="game-contact-form-submit" disabled={isSubmitting}>
                        {isSubmitting ? "INVIO..." : "INVIA"}
                    </button>
                </form>
            </div>
        </div>
    );
}
