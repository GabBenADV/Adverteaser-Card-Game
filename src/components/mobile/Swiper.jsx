import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import solutions from "../../data/solutions.json";
import useSwiper from "../../hooks/useSwiper";
import useMobileForm from "../../hooks/useMobileForm";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "../../swiper.css";

import { EffectCoverflow, Pagination } from "swiper/modules";

export default function SwiperComponent({ setSuccess, setInteractions, interactions }) {
  const [face, setFace] = useState(0);      // 0..3
  const [error, setError] = useState(null);

  const { activeIndex, onSwiper, onSlideChange, handleFaceChange, openForm, closeForm } =
    useSwiper(setFace, face, solutions, setInteractions, interactions);

  const { register, onSubmit, isSubmitting } = useMobileForm(
    activeIndex,
    solutions[activeIndex],
    setError,
    setInteractions,
    setFace,
    setSuccess,
    () => {
      // dopo submit ok: torna alla soluzione (o dove vuoi)
      setFace(0);
      setSuccess(true);
      setInteractions(0);
    }
  );

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  return (
    <div
      style={{
        backgroundImage: "url(/dist/bg-intro.png)",
        backgroundPosition: "center",
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Swiper
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        effect={"coverflow"}
        centeredSlides
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination
        spaceBetween={-20}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        {[...Array(31)].map((_, index) => (
          <SwiperSlide
            key={index}
            className={`swiper-slide--${index}`}
            style={{ position: "relative" }}
          >
            <div className="images-container" onClick={() => handleFaceChange(index)}>
              <div
                style={{ backgroundColor: index % 2 === 0 ? "#b60d45" : "#1a1a1a" }}
                className="face face--2 solution"
              >
                <div className="solution-title">{solutions[index].cta}</div>
                {/* <div className="solution-category">{solutions[index].category}</div> */}
                <div className="solution-description">{solutions[index].solution}</div>
              </div>

              <img
                src={`/dist/cards/front_${pad2(index)}.webp`}
                alt=""
                className="face face--1"
              />
              <img
                src={`/dist/cards/back_${pad2(index)}.webp`}
                alt=""
                className="face face--0"
              />
            </div>

            {/* CTA overlay (step 2) */}
            <div
              className="solution-overlay"
              style={{ backgroundColor: index % 2 === 0 ? "#b60d45" : "#1a1a1a" }}
            >
              <div className="solution-cta" onClick={() => openForm(index)}>
                Clicca qui
              </div>
            </div>

            {/* FORM (step 3) — montalo SOLO sulla slide attiva per evitare duplicati RHF */}
            {index === activeIndex && (
              <form className="mobile-form" action="" onSubmit={onSubmit}>
                <div className="mobile-form-title" style={{ fontSize: 20 }}>
                  Lasciaci il tuo contatto
                </div>

                {/* category sempre presente */}
                <input type="hidden" {...register("category", { required: "Categoria mancante" })} />

                {/* evita id duplicati tra slide */}
                <input
                  type="text"
                  placeholder="Nome e Cognome"
                  {...register("name", { required: "Inserisci nome e cognome" })}
                />

                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Inserisci una email",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email non valida",
                    },
                  })}
                />

                {error && <div className="mobile-form-error">{error}</div>}

                <div className="mobile-form-actions">
                  <button type="button" onClick={closeForm} disabled={isSubmitting}>
                    Indietro
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Invio..." : "Invia"}
                  </button>
                </div>
              </form>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* overlay nero: IMPORTANTISSIMO che non blocchi click */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          background: "rgba(0,0,0,0.8)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}