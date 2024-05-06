import generateApiKey from "./authApi";

const baseUrl = "https://v2.api.noroff.dev";

/* Get user bookings */

export async function getUserBookings(profileName, accessToken) {
  try {
    const apiKey = await generateApiKey(accessToken);
    const url = `${baseUrl}/holidaze/profiles/${encodeURIComponent(
      profileName
    )}/bookings?_venue=true`; // Added _venue=true to include venue details
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `API error: ${response.status} ${errorData.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting user bookings:", error.message);
    throw error;
  }
}

export async function fetchUserBookings(
  username,
  accessToken,
  setBookings,
  setError
) {
  try {
    const response = await getUserBookings(username, accessToken);
    setBookings(response.data);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    setError("Error fetching bookings: " + error.message);
  }
}

/* Delete booking */

export async function deleteBooking(bookingId, accessToken) {
  try {
    const apiKey = await generateApiKey(accessToken);
    const url = `${baseUrl}/holidaze/bookings/${encodeURIComponent(bookingId)}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `API error: ${response.status} ${
        errorData.message || "Failed to delete booking"
      }`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    console.log("Booking deleted successfully.");
    return "Deleted successfully";
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    throw error;
  }
}

export const handleDeleteBooking = async (
  bookingId,
  accessToken,
  successCallback,
  errorCallback
) => {
  if (window.confirm("Are you sure you want to delete this booking?")) {
    try {
      const message = await deleteBooking(bookingId, accessToken);
      alert(message);
      successCallback(bookingId);
    } catch (error) {
      console.error("Error deleting booking:", error.message);
      errorCallback(`Error deleting booking: ${error.message}`);
      alert(error.message);
    }
  }
};
