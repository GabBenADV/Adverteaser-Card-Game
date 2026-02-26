import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import { set } from "react-hook-form";
import { trackInteraction } from "../utils/trackInteraction";
import { getSessionId } from "../utils/sessionId";

export default function useSwiper(setFace, face, solutions, setInteractions, interactions) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onSwiper = useCallback((swiperInstance) => {
    setActiveIndex(swiperInstance.activeIndex);
    setFace(0);
    setInteractions(0);
  }, [setFace, setInteractions]);

  const onSlideChange = useCallback((swiperInstance) => {
    setActiveIndex(swiperInstance.activeIndex);
    if(face !== 0) {
      trackInteraction({
        session_id: getSessionId(),
        card_index: activeIndex,
        step: interactions,
        device: 'mobile',
        category: solutions[activeIndex]?.category || null,
        card_type: (activeIndex % 2 == 0) ? 'opportunita' : 'imprevisto',
        completed: 0
      });
    }
    setInteractions(0);
    setFace(0);
  }, [setFace, activeIndex, interactions, solutions]);

  // tap sulla card: ciclo solo tra 0-1-2 (il form è step 3 e lo apri via CTA)
  const handleFaceChange = useCallback(
    (index) => {
      if (index !== activeIndex) {
        setFace(0);
        setInteractions(0);
        return;
      }
      setFace((prev) => (prev < 2 ? prev + 1 : 0));
      setInteractions((prev) => (prev < 2 ? prev + 1 : 0));
    },
    [activeIndex, setFace, setInteractions]
  );

  // CTA: apre lo step form (3) solo se sei sulla slide attiva
  const openForm = useCallback(
    (index) => {
      if (index !== activeIndex) return;
      setFace(3);
      setInteractions(3);
    },
    [activeIndex, setFace, setInteractions]
  );

  const closeForm = useCallback(() => {
    // torna alla soluzione
    setFace(2);
  }, [setFace]);

  useEffect(() => {
    const activeSlide = document.querySelector(`.swiper-slide--${activeIndex}`);
    if (!activeSlide) return;

    const backFace = activeSlide.querySelector(".face--0");
    const frontFace = activeSlide.querySelector(".face--1");
    const solutionFace = activeSlide.querySelector(".face--2");
    const solutionOverlay = activeSlide.querySelector(".solution-overlay");
    const form = activeSlide.querySelector(".mobile-form");

    // reset “soft” per evitare stati sporchi (null-safe)
    const tl = gsap.timeline({ defaults: { duration: 0.2 } });

    const hide = (el) => el && tl.to(el, { autoAlpha: 0, overwrite: "auto" }, 0);
    const show = (el) => el && tl.to(el, { autoAlpha: 1, overwrite: "auto" }, 0);

    // pointer-events: quando non è form, overlay e form non devono bloccare tap
    if (solutionOverlay) solutionOverlay.style.pointerEvents = "none";
    if (form) form.style.pointerEvents = "none";

    if (face === 0) {
      show(backFace);
      hide(frontFace);
      hide(solutionFace);
      hide(solutionOverlay);
      hide(form);
    } else if (face === 1) {
      hide(backFace);
      show(frontFace);
      hide(solutionFace);
      hide(solutionOverlay);
      hide(form);
    } else if (face === 2) {
      hide(backFace);
      hide(frontFace);
      show(solutionFace);
      show(solutionOverlay);
      hide(form);
      if (solutionOverlay) solutionOverlay.style.pointerEvents = "auto";
    } else if (face === 3) {
      // step form: puoi decidere se lasciare la soluzione visibile dietro o no
      hide(backFace);
      hide(frontFace);
      show(solutionFace);
      hide(solutionOverlay);
      show(form);
      if (form) form.style.pointerEvents = "auto";
    }
  }, [activeIndex, face]);

  return { activeIndex, onSwiper, onSlideChange, handleFaceChange, openForm, closeForm };
}