const baseUrl = "https://v2.api.noroff.dev";

/* Register */
export async function registerUser(
  name,
  email,
  password,
  avatar,
  venueManager
) {
  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        avatar: avatar || undefined,
        venueManager: venueManager || undefined,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data };
    } else {
      console.error("Error response from server:", data);

      const errorMessage =
        data.message || "An error occurred during registration.";
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error("Network or JSON parsing error:", error);
    return { success: false, message: error.message };
  }
}

/* Login */

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { data } = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);
      if (data.avatar) {
        localStorage.setItem("userAvatarUrl", data.avatar.url);
        localStorage.setItem("userAvatarAlt", data.avatar.alt);
      }
      if (data.banner) {
        localStorage.setItem("userBannerUrl", data.banner.url);
        localStorage.setItem("userBannerAlt", data.banner.alt);
      }

      return { success: true, data };
    } else {
      const { message } = await response.json();
      return { success: false, message };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/* Logout */
export async function logoutUser() {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userCredits");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatarUrl");
    localStorage.removeItem("userAvatarAlt");
    localStorage.removeItem("userBannerUrl");
    localStorage.removeItem("userBannerAlt");
    localStorage.removeItem("userEmail");
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error.message);
    return { success: false, message: error.message };
  }
}

/* Create API Key */

const generateApiKey = async (accessToken) => {
  try {
    const response = await fetch(
      "https://v2.api.noroff.dev/auth/create-api-key",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data.key;
  } catch (error) {
    console.error("Error generating API key:", error);
    return null;
  }
};

export default generateApiKey;
