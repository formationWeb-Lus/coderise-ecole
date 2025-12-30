// utils/sessionExpiration.ts

/**
 * Définit le timer de session côté client
 * @param durationSeconds Durée avant expiration en secondes (ex: 10, 30, 120)
 */
export function setSessionTimer(durationSeconds: number) {
  const expireAt = Date.now() + durationSeconds * 1000;
  localStorage.setItem("sessionExpire", expireAt.toString());
}

/**
 * Vérifie si la session a expiré
 * @returns true si la session est expirée ou non définie, false sinon
 */
export function checkSessionExpired(): boolean {
  const expireAt = localStorage.getItem("sessionExpire");
  if (!expireAt) return true; // pas de session -> considéré expiré
  return Date.now() > parseInt(expireAt, 50);
}

/**
 * Réinitialise le timer de session avec la durée choisie
 * @param durationSeconds Durée avant expiration en secondes
 */
 
export function resetSessionTimer(durationSeconds: number) {
  setSessionTimer(durationSeconds);
}

/**
 * Supprime le timer de session (ex: lors de logout)
 */
export function clearSessionTimer() {
  localStorage.removeItem("sessionExpire");
}

/**
 * Fonctions utilitaires pour durée standard
 */
export const SessionDurations = {
  SHORT: 50,   // 50 secondes
  MEDIUM: 90,  // 90 secondes
  LONG: 120,   // 2 minutes
};
