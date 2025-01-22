let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = (): string | null => {
    return accessToken || localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
};

/**
 * 
 * @param token 
 * @param rememberMe 
 */
export const storeToken = (token: string, rememberMe?: boolean) => {
    if (rememberMe !== undefined) {
      // Lorsque rememberMe est fourni (par exemple dans login)
      if (rememberMe) {
        localStorage.setItem("accessToken", token);
        console.log("Token stocké dans localStorage :", token);
      } else {
        sessionStorage.setItem("accessToken", token);
        console.log("Token stocké dans sessionStorage :", token);
      }
    } else {
      // Lorsque rememberMe n'est pas fourni (par exemple dans l'intercepteur)
      if (localStorage.getItem("accessToken") !== null) {
        localStorage.setItem("accessToken", token);
      } else {
        sessionStorage.setItem("accessToken", token);
      }
    }
  };
  
  
  /**
   * 
   * @param token 
   */
  export const storeTokenInCurrentStorage = (token: string) => {
    if (localStorage.getItem("accessToken") !== null) {
      localStorage.setItem("accessToken", token);
      console.log("Token mis à jour dans localStorage :", token);
    } else {
      sessionStorage.setItem("accessToken", token);
      console.log("Token mis à jour dans sessionStorage :", token);
    }
  };
  
export const removeToken = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
};

export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    console.log("Tokens supprimés de localStorage et sessionStorage");
};
