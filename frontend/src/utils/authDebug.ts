/**
 * Utility functions for debugging authentication issues
 */

/**
 * Logs the current authentication state to the console
 */
export const logAuthState = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  console.group("Authentication Debug Info");
  console.log("Access Token exists:", !!accessToken);
  if (accessToken) {
    console.log("Access Token preview:", accessToken.substring(0, 15) + "...");

    try {
      // Try to decode the JWT payload (not for security, just for debugging)
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      console.log("Token payload:", payload);

      // Check if token is expired
      const expiryDate = new Date(payload.exp * 1000);
      const now = new Date();
      console.log("Token expires:", expiryDate.toLocaleString());
      console.log("Token expired:", expiryDate < now);
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  }

  console.log("Refresh Token exists:", !!refreshToken);
  console.groupEnd();

  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
  };
};

/**
 * Clears all authentication tokens from localStorage
 */
export const clearAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  console.log("All authentication tokens cleared");
};

/**
 * Adds a debug token to localStorage (for testing only)
 */
export const setDebugToken = (token: string) => {
  localStorage.setItem("accessToken", token);
  console.log("Debug access token set");
};
