import gsap from "gsap";
import { useMemo, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { trackInteraction } from "../utils/trackInteraction";
import { getSessionId } from "../utils/sessionId";

export default function useCardForm( formRef, cardRef, item, setSuccess, setPlaysCounter, setError, setInteractions, interactions, selectedIndex) {

    const defaultCategory = item?.category ?? "";

    const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({ defaultValues: {
        category: defaultCategory,
        name: "",
        email: "",
      },
      mode: "onSubmit",
    });

    useEffect(() => {
      setValue("category", item?.category ?? "");
      reset({ category: item?.category ?? "", name: "", email: "" });
    }, [item?.category, setValue]);

    const onValid = async (values) => {
      setError?.(null);

      try {

        const res = await fetch("/api/leads.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const raw = await res.text();
        let data = null;

        try { data = JSON.parse(raw) } catch { console.error("Failed to parse JSON:", raw); }

        if (!res.ok) { throw new Error(data?.error || raw || `HTTP ${res.status}`) }

        const ok = data?.ok === true || data?.success === true;

        if (!ok) { throw new Error(data?.error || "Invio non riuscito") }

        setPlaysCounter(0);
        setSuccess(true);

        trackInteraction({
          session_id: getSessionId(), 
          card_index: selectedIndex,
          step: 3,
          device: 'desktop',
          category: item?.category ?? null,
          card_type: (selectedIndex % 2 === 0) ? "opportunita" : "imprevisto",
          completed: 1
        });

        // reset form (mantieni category)
        reset({ category: values.category, name: "", email: "" });
        setInteractions(0)

      } catch (err) {
        console.error("Fetch leads.php failed:", err);
        setError?.(err?.message || "Errore invio");
      }
    };

    const onInvalid = (errs) => {
      const msg =
		    errs?.name?.message ||
        errs?.email?.message ||
        errs?.category?.message ||
        "Dati non validi";
      setError?.(msg);
    };

    // handler pronto da attaccare al form
    const onSubmit = useMemo(
      () => handleSubmit(onValid, onInvalid),
      [handleSubmit, item?.category],
    );

  function handleCTA() {
    
    setInteractions(2);
    const tl = gsap.timeline();

    if (formRef.current && cardRef.current) {
      tl.to(formRef.current, { autoAlpha: 1, zIndex: 10, duration: 0.5 }).to(
        cardRef.current,
        { autoAlpha: 0, duration: 0.5 },
        -0.5,
      );
    }
  }

  return { register, onSubmit, isSubmitting, handleCTA };
}
