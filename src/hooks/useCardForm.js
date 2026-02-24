import gsap from "gsap";

export default function useCardForm(formRef, cardRef, item) {
  async function submitForm(e) {
    let email = formRef.current.querySelector("#email").value;
    let category = formRef.current.querySelector("#category").value;
    console.log("email:", email, "and category:", category);
    e.preventDefault();
    try {
      const res = await fetch("/api/leads.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          category: category,
        }),
      });
      const raw = await res.text();
      console.log("status:", res.status);
      console.log("raw response:", raw);

      // prova a parse
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = null;
      }
      console.log("parsed json:", data);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error("Fetch leads.php failed:", err);
    }
  }

  function handleCTA() {
    // qui puoi gestire l'azione del CTA, ad esempio aprire un link o inviare un form
    const tl = gsap.timeline();
    console.log("CTA clicked for item:", item);
    if (formRef.current && cardRef.current) {
      tl.to(formRef.current, { autoAlpha: 1, zIndex: 10, duration: 0.5 }).to(
        cardRef.current,
        { autoAlpha: 0, duration: 0.5 },
        -0.5,
      );
    }
  }

  return { submitForm, handleCTA };
}
