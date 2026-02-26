export function getSessionId() {
  const key = "card_game_session";
  let v = sessionStorage.getItem(key);
  if (!v) {
    v = (crypto?.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    sessionStorage.setItem(key, v);
  }
  return v;
}