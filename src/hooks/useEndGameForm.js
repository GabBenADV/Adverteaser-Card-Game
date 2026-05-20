import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { isRecaptchaEnabled } from "../config/recaptcha.config";

export default function useEndGameForm(
  setSteps,
  steps,
  setPlaysCounter,
  setSuccess,
) {

  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    trigger,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      category: "",
      name: "",
      email: "",
      recaptchaToken: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    // shouldUnregister: true,
  });
  const [recaptchaResetKey, setRecaptchaResetKey] = useState(0);

  useEffect(() => {
    setSubmitError(null);
    clearErrors();
  }, [steps, clearErrors]);

  // Messaggio errore “compatibile” con il tuo EndGame (stringa unica)
  const categoryErr = errors?.category?.message ?? null;
  const nameErr = errors?.name?.message ?? null;
  const emailErr = errors?.email?.message ?? null;
  const recaptchaErr = errors?.recaptchaToken?.message ?? null;

  const formError =
    submitError ||
    (steps === 0 ? categoryErr : (nameErr || emailErr || recaptchaErr));

  const setRecaptchaToken = useCallback((token) => {
    setValue("recaptchaToken", token, {
      shouldDirty: Boolean(token),
      shouldValidate: Boolean(token),
    });
  }, [setValue]);

  async function nextStep(e) {
    e.preventDefault();
    setSubmitError(null);

    const ok = await trigger(["category"]);
    if (!ok) return;

    setSteps(steps + 1);
  }

  function prevStep(e) {
    e.preventDefault();
    setSubmitError(null);
    setSteps(steps - 1);
  }

  const onValidSubmit = async (values) => {
    setSubmitError?.(null);

    try {
      const res = await fetch("/api/leads.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const raw = await res.text();
      let data = null;
      try { data = JSON.parse(raw); } catch { data = null; }

      if (!res.ok) {
        throw new Error(data?.error || raw || `HTTP ${res.status}`);
      }

      const ok = data?.success === true || data?.ok === true;
      if (!ok) {
        throw new Error(data?.error || "Invio non riuscito");
      }

      // Comportamento come il tuo codice originale
      setPlaysCounter?.(0);
      setSuccess?.(true);
      // setActiveObject?.(null);
      // setSelectedIndex?.(null);

      // reset mantenendo la categoria selezionata (opzionale)
      reset({ category: values.category, name: "", email: "", recaptchaToken: "" });
      setRecaptchaResetKey((key) => key + 1);
    } catch (err) {
      console.error("Fetch leads.php failed:", err);
      setSubmitError(err?.message || "Errore invio");
    }
  };

  // handler RHF pronto per <form onSubmit=...> oppure onClick
  const onSubmit = handleSubmit(onValidSubmit);

  function close() {
    setPlaysCounter(0);
  }

  const recaptchaRules = isRecaptchaEnabled
    ? { required: "Conferma il reCAPTCHA" }
    : undefined;

  return {
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
  };
}
