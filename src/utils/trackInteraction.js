export async function trackInteraction(payload) {
  const url = "/api/card_game_interactions.php";
  const body = JSON.stringify(payload);

  // if (navigator.sendBeacon) {
  //   navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
  //   return;
  // }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const raw = await res.text();
    let data = null;
    try { data = JSON.parse(raw); } catch {}

    if (!res.ok) throw new Error(data?.error || raw || `HTTP ${res.status}`);

    const ok = data?.ok === true || data?.success === true;
    if (!ok) throw new Error(data?.error || "Invio non riuscito");
  } catch (err) {
    console.error("Errore tracciamento interazione:", err);
  }
}