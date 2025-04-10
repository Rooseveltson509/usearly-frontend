// ✅ Variable en mémoire (utile pour éviter les lectures répétées)
let accessToken: string | null = null;

/**
 * ✅ Définit le token dans la mémoire locale uniquement
 */
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

/**
 * ✅ Récupère le token depuis la mémoire ou le stockage
 */
export const getAccessToken = (): string | null => {
  return (
    accessToken || localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );
};

/**
 * ✅ Stocke le token en fonction du rememberMe + userType
 */
export const storeToken = (
  token: string,
  rememberMe: boolean = false,
  userType: "user" | "brand" = "user"
) => {
  const storageKey = userType === "brand" ? "brandAccessToken" : "accessToken";

  if (rememberMe) {
    localStorage.setItem(storageKey, token);
    console.log(`✅ Token stocké dans localStorage (${storageKey})`);
  } else {
    sessionStorage.setItem(storageKey, token);
    console.log(`✅ Token stocké dans sessionStorage (${storageKey})`);
  }

  setAccessToken(token);
};

/**
 * ✅ Met à jour le token dans le stockage déjà utilisé
 */
export const storeTokenInCurrentStorage = (token: string) => {
  if (localStorage.getItem("accessToken") !== null) {
    localStorage.setItem("accessToken", token);
    console.log("🔁 Token mis à jour dans localStorage");
  } else {
    sessionStorage.setItem("accessToken", token);
    console.log("🔁 Token mis à jour dans sessionStorage");
  }

  setAccessToken(token);
};

/**
 * ✅ Supprime le token des deux stockages
 */
export const removeToken = () => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
  setAccessToken(null);
};

/**
 * ✅ Supprime tous les tokens (y compris ceux des marques)
 */
export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("brandAccessToken");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("brandAccessToken");
  setAccessToken(null);

  console.log("🧹 Tous les tokens ont été supprimés");
};
