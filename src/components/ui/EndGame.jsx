import { useState } from "react";
import categories from "../../data/categories.json";
import useEndGameForm from "../../hooks/useEndGameForm";
import { isRecaptchaEnabled } from "../../config/recaptcha.config";
import Recaptcha from "./Recaptcha";

export default function EndGame({ setPlaysCounter, setSuccess }) {

  const [steps, setSteps] = useState(0);
  const {
    register,
    nextStep,
    prevStep,
    onSubmit,
    close,
    formError,
    isSubmitting,
    setRecaptchaToken,
    recaptchaResetKey,
    recaptchaRules,
  } = useEndGameForm(setSteps, steps, setPlaysCounter, setSuccess);
  
  return (
    <div className="endGame">
      <button id="close" onClick={close}>
        Rigioca
      </button>
      <form
        className="endgame-contact-form"
        action=""
        onSubmit={steps > 0 ? onSubmit : (e) => e.preventDefault()}
      >
        <h2 style={{color: "white"}}>Non hai trovato quello che cercavi?</h2>
        {steps === 0 && (<h3 style={{color: "white"}}>Di cosa ti occupi o cosa cerchi?</h3>)}
        {steps > 0 && (<h3 style={{color: "white"}}>Raccontaci chi sei</h3>)}
        {steps === 0 && (
          <div className="inputs-container endgame-category">
            {/* <select
              id="category"
              {...register("category", { required: "Scegli un ambito" })}
            >
              <option value="">Scegli un ambito</option>
              {categories.map((c, i) => (
                <option key={i} value={c.value}>{c.value}</option>
              ))}
            </select> */}
            {categories.map((c, i) => (
              <div key={i} className="checkbox-container">
                <input key={i} type="checkbox" id={c.value} value={c.value} {...register("category", { required: "Scegli un ambito" })} />
                <label htmlFor={c.value}>{c.value}</label> 
              </div>
            ))}
          </div>
        )}
        {steps > 0 && (
          <div className="inputs-container endgame-user-info">
            <input type="text" placeholder="Nome e Cognome" id="name" {...register("name", { required: "Inserisci nome e cognome" })} />
            <input type="email" placeholder="Email" id="email" {...register("email", 
              { 
                required: "Inserisci una email", 
                pattern: { 
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                  message: "Email non valida" 
                } 
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
          </div>
        )}
        {formError && <div className="form-error">{formError}</div>}
        {steps === 0 && (
          <button type="submit" onClick={(e) => nextStep(e)}>
            Prossimo
          </button>
        )}
        {steps > 0 && (
          <div>
            <button type="button" onClick={prevStep} disabled={isSubmitting}>
              Indietro
            </button>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Invio..." : "Inviaci la tua richiesta"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
