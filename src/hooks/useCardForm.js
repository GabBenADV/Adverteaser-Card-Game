import gsap from "gsap";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trackInteraction } from "../utils/trackInteraction";
import { getSessionId } from "../utils/sessionId";
import { isRecaptchaEnabled } from "../config/recaptcha.config";

export default function useCardForm( formRef, cardRef, item, setSuccess, setPlaysCounter, setError, setInteractions, interactions, selectedIndex) {

    const defaultCategory = item?.category ?? "";

    const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({ defaultValues: {
        category: defaultCategory,
        name: "",
        email: "",
        recaptchaToken: "",
      },
      mode: "onSubmit",
    });
    const [recaptchaResetKey, setRecaptchaResetKey] = useState(0);

    useEffect(() => {
      setValue("category", item?.category ?? "");
      reset({ category: item?.category ?? "", name: "", email: "", recaptchaToken: "" });
      setRecaptchaResetKey((key) => key + 1);
    }, [item?.category, reset, setValue]);

    const setRecaptchaToken = useCallback((token) => {
      setValue("recaptchaToken", token, {
        shouldDirty: Boolean(token),
        shouldValidate: Boolean(token),
      });
    }, [setValue]);

    const onValid = async (values) => {
      setError?.(null);

      try {

        const res = await fetch("/api/leads.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const raw = await res.text();
        console.log("status:", res.status);
        console.log("raw:", raw);

        let data = null;
        try { data = JSON.parse(raw); } catch { data = null; }

        if (!res.ok) throw new Error(data?.error || raw || `HTTP ${res.status}`);

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
        reset({ category: values.category, name: "", email: "", recaptchaToken: "" });
        setRecaptchaResetKey((key) => key + 1);
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
        errs?.recaptchaToken?.message ||
        "Dati non validi";
      setError?.(msg);
    };

    // handler pronto da attaccare al form
    const onSubmit = handleSubmit(onValid, onInvalid);

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

  const recaptchaRules = isRecaptchaEnabled
    ? { required: "Conferma il reCAPTCHA" }
    : undefined;

  return {
    register,
    onSubmit,
    isSubmitting,
    handleCTA,
    setRecaptchaToken,
    recaptchaResetKey,
    recaptchaRules,
  };
}
