import generateApiKey from "./authApi";
const baseUrl = "https://v2.api.noroff.dev/holidaze";

// Function to create a venue
export async function createVenue(venueData, accessToken) {
  const apiKey = await generateApiKey(accessToken);
  const response = await fetch(`${baseUrl}/venues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
    body: JSON.stringify(venueData),
  });
  if (!response.ok) {
    throw new Error("Failed to create venue");
  }
  return response.json();
}

// Function to fetch all user venues
export async function fetchMyVenues(accessToken) {
  try {
    const profileName = localStorage.getItem("userName");
    const apiKey = await generateApiKey(accessToken);
    const url = `${baseUrl}/profiles/${encodeURIComponent(profileName)}/venues`;
    console.log("Fetching from URL:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    });
    console.log("Network Response:", response);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `API error: ${response.status} ${errorData.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log("Fetched Data:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error fetching venues:", error.message);
    throw error;
  }
}

/* Function to delete a venue */

export const deleteVenue = async (id, accessToken) => {
  const apiKey = await generateApiKey(accessToken);
  const response = await fetch(`${baseUrl}/venues/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to delete venue, received status ${response.status}`
    );
  }
  return true;
};

/* Function to update a venue */

export const updateVenue = async (id, data, accessToken) => {
  const apiKey = await generateApiKey(accessToken);
  const response = await fetch(`${baseUrl}/venues/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to update venue, received status ${response.status}`
    );
  }
  const updatedData = await response.json();
  return updatedData.data; // Return the updated venue data
};
