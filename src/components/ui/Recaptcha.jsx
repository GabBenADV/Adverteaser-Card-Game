import { useEffect, useRef, useState } from "react";
import { RECAPTCHA_SITE_KEY } from "../../config/recaptcha.config";

const SCRIPT_ID = "google-recaptcha-script";
const RECAPTCHA_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";

function loadRecaptchaScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window non disponibile"));
  }

  if (window.grecaptcha?.render) {
    return Promise.resolve(window.grecaptcha);
  }

  if (window.__recaptchaScriptPromise) {
    return window.__recaptchaScriptPromise;
  }

  window.__recaptchaScriptPromise = new Promise((resolve, reject) => {
    const resolveWhenReady = () => {
      if (!window.grecaptcha) {
        reject(new Error("reCAPTCHA non caricato"));
        return;
      }

      window.grecaptcha.ready(() => resolve(window.grecaptcha));
    };

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", resolveWhenReady, { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Errore caricamento reCAPTCHA")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = RECAPTCHA_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolveWhenReady;
    script.onerror = () => reject(new Error("Errore caricamento reCAPTCHA"));

    document.head.appendChild(script);
  });

  return window.__recaptchaScriptPromise;
}

export default function Recaptcha({ onVerify, resetKey = 0 }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    onVerify?.("");

    loadRecaptchaScript()
      .then((grecaptcha) => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) {
          return;
        }

        widgetIdRef.current = grecaptcha.render(containerRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: (token) => onVerify?.(token),
          "expired-callback": () => onVerify?.(""),
          "error-callback": () => {
            onVerify?.("");
            setLoadError("reCAPTCHA non disponibile. Riprova.");
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Impossibile caricare reCAPTCHA.");
        }
      });

    return () => {
      cancelled = true;
      onVerify?.("");

      if (window.grecaptcha && widgetIdRef.current !== null) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch {
          // Il widget potrebbe essere gia' stato rimosso dal DOM.
        }
      }

      widgetIdRef.current = null;
    };
  }, [onVerify]);

  useEffect(() => {
    if (window.grecaptcha && widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current);
      onVerify?.("");
    }
  }, [resetKey, onVerify]);

  return (
    <div className="recaptcha-field">
      <div ref={containerRef} />
      {loadError && <div className="recaptcha-error">{loadError}</div>}
    </div>
  );
}
