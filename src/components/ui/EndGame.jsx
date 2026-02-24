import { useState } from "react";
import categories from "../../data/categories.json";

export default function EndGame({ setPlaysCounter }) {

  const [steps, setSteps] = useState(0);
  
  function nextStep() {
    setSteps(steps + 1);
  }

  function prevStep() {
    setSteps(steps - 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = document.querySelector(".endgame-contact-form");
  }

  function close() {
    setPlaysCounter(0);
  }
  
  return (
    <div className="endGame">
      <button id="close" onClick={close}>
        Rigioca
      </button>
      <form className="endgame-contact-form" action="">
        <h2>Non hai trovato quello che cercavi?</h2>
        <p>Di cosa ti occupi o cosa cerchi?</p>
        {steps === 0 && (
          <div className="inputs-container endgame-category">
            <select name="category" id="category">
              <option value="">Scegli un ambito</option>
              {categories.map((c, i) => (
                <option key={i} value={c.value}>{c.value}</option>
              ))}
            </select>
            <button type="submit" onClick={nextStep}>Prossimo</button>
          </div>
        )}
        {steps > 0 && (
          <div className="inputs-container endgame-user-info">
            <input type="text" placeholder="Nome e Cognome" id="name" name="name" />
            <input type="email" placeholder="Email" id="email" name="email" />
            <div>
              <button type="button" onClick={prevStep}>Indietro</button>
              <button type="submit" onClick={handleSubmit}>Inviaci la tua richiesta</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}