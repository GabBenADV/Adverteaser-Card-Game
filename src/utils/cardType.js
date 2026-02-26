export function getCardType(item) {
  const t = (item?.title || "").toLowerCase();
  if (t.includes("imprevisto")) return "imprevisto";
  if (t.includes("opportunità") || t.includes("opportunita")) return "opportunita";
  return "opportunita"; // fallback
}