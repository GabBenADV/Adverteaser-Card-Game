import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { trackInteraction } from "../utils/trackInteraction";
import { getSessionId } from "../utils/sessionId";

export default function useMobileForm(activeIndex,item, setError, onSuccess, setInteractions, setFace, setSuccess) {
  const defaultCategory = item?.category ?? "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      category: defaultCategory,
      name: "",
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: false,
  });

  // Quando cambia slide (item), aggiorna category e resetta name/email
  useEffect(() => {
    const cat = item?.category ?? "";
    setValue("category", cat);
    reset({ category: cat, name: "", email: "" });
  }, [item?.category, reset, setValue]);

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
      try { data = JSON.parse(raw); } catch {}

      if (!res.ok) throw new Error(data?.error || raw || `HTTP ${res.status}`);

      const ok = data?.ok === true || data?.success === true;
      if (!ok) throw new Error(data?.error || "Invio non riuscito");

      trackInteraction({
        session_id: getSessionId(),
        card_index: activeIndex,
        step: 4, // form submitted
        device: 'mobile',
        category: item?.category ?? null,
        card_type: (activeIndex % 2 == 0) ? 'opportunita' : 'imprevisto',
        completed: 1
      });

      // reset mantenendo la category
      reset({ category: values.category, name: "", email: "" });
      onSuccess?.(() => {
        setFace(0);
        setSuccess(true);
        setInteractions(0);
      });

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

  const onSubmit = useMemo(() => handleSubmit(onValid, onInvalid), [handleSubmit, item?.category]);

  return { register, onSubmit, isSubmitting };
}