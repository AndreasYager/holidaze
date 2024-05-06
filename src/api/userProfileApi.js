import generateApiKey from "./authApi";
const baseUrl = "https://v2.api.noroff.dev";

/* Update User Profile Avatar */
export async function updateProfileAvatar(profileName, avatarUrl, accessToken) {
  try {
    const apiKey = await generateApiKey(accessToken);

    const url = `${baseUrl}/holidaze/profiles/${encodeURIComponent(
      profileName
    )}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify({ avatar: { url: avatarUrl } }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `API error: ${response.status} ${errorData.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage); // Throw the error for further handling
    }

    // Update local storage with the new avatar URL
    localStorage.setItem("userAvatarUrl", avatarUrl);
    window.location.reload(); // Reload the page to reflect the changes

    return await response.json();
  } catch (error) {
    console.error("Error updating user profile avatar:", error.message);
    throw error;
  }
}

export const handleAvatarUpdate = async (
  username,
  newAvatarUrl,
  accessToken,
  setAvatar,
  errorCallback,
  closeModal
) => {
  if (!newAvatarUrl) {
    alert("Please enter a valid URL for the avatar.");
    return;
  }
  try {
    const response = await updateProfileAvatar(
      username,
      newAvatarUrl,
      accessToken
    );
    if (response && response.avatar) {
      setAvatar(response.avatar.url);
      localStorage.setItem("userAvatarUrl", response.avatar.url);
      alert("Avatar updated successfully!");
      closeModal();
    } else {
      errorCallback("Failed to update avatar. No new avatar URL returned.");
    }
  } catch (error) {
    console.error("Error updating avatar:", error.message);
    errorCallback(`Error updating avatar: ${error.message}`);
    alert(error.message);
  }
};

/* Update User Profile Banner */
export async function updateProfileBanner(profileName, bannerUrl, accessToken) {
  try {
    const apiKey = await generateApiKey(accessToken);

    const url = `${baseUrl}/holidaze/profiles/${encodeURIComponent(
      profileName
    )}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify({ banner: { url: bannerUrl } }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `API error: ${response.status} ${errorData.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage); 
    }

    localStorage.setItem("userBannerUrl", bannerUrl);
    window.location.reload(); 

    return await response.json();
  } catch (error) {
    console.error("Error updating user profile banner:", error.message);
    throw error;
  }
}

export const handleBannerUpdate = async (
  username,
  newBannerUrl,
  accessToken,
  setBanner,
  errorCallback,
  closeModal
) => {
  if (!newBannerUrl) {
    alert("Please enter a valid URL for the banner.");
    return;
  }
  try {
    const response = await updateProfileBanner(
      username,
      newBannerUrl,
      accessToken
    );
    if (response && response.banner) {
      setBanner(response.banner.url);
      localStorage.setItem("userBannerUrl", response.banner.url);
      alert("Banner updated successfully!");
      closeModal();
    } else {
      errorCallback("Failed to update banner. No new banner URL returned.");
    }
  } catch (error) {
    console.error("Error updating banner:", error.message);
    errorCallback(`Error updating banner: ${error.message}`);
    alert(error.message);
  }
};

/* Update Venue Manager Status */

export async function updateVenueManagerStatus(
  username,
  isVenueManager,
  accessToken
) {
  try {
    const apiKey = await generateApiKey(accessToken);
    const url = `${baseUrl}/holidaze/profiles/${encodeURIComponent(username)}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify({ venueManager: isVenueManager }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `API error: ${response.status} ${errorData.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }


    localStorage.setItem("isVenueManager", isVenueManager ? "true" : "false");

    return await response.json();
  } catch (error) {
    console.error("Error updating venue manager status:", error.message);
    throw error;
  }
}

export const handleVenueManagerStatusUpdate = async (
  username,
  newStatus,
  accessToken,
  setIsVenueManager,
  errorCallback,
  closeModal
) => {
  try {
    const response = await updateVenueManagerStatus(
      username,
      newStatus,
      accessToken
    );
    if (response && response.success) {
      setIsVenueManager(newStatus);
      localStorage.setItem("isVenueManager", newStatus ? "true" : "false");
      alert("Venue manager status updated successfully!");
      closeModal(); 
    } else {
    }
  } catch (error) {
    console.error("Error updating venue manager status:", error.message);
    errorCallback(`Error updating venue manager status: ${error.message}`);
    alert(error.message);
  }
};
