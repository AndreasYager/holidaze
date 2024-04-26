const baseUrl = "https://v2.api.noroff.dev/holidaze";

export const fetchVenues = async () => {
  try {
    const response = await fetch(`${baseUrl}/venues`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json.data; // Return data for use in component
  } catch (error) {
    console.error("Failed to fetch venues:", error);
    return []; // Return an empty array to prevent errors in rendering
  }
};

export const fetchVenueDetails = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/venues/${id}?_bookings=true`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json.data; // Return venue data for use in component
  } catch (error) {
    console.error("Failed to fetch venue details:", error);
    return null; // Return null to indicate an error in fetching
  }
};
