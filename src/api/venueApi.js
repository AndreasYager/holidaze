const baseUrl = "https://v2.api.noroff.dev/holidaze";

export const fetchVenues = async (
  page = 1,
  limit = 12,
  sort = "name",
  sortOrder = "desc"
) => {
  try {
    const response = await fetch(
      `${baseUrl}/venues?page=${page}&limit=${limit}&sort=${sort}&sortOrder=${sortOrder}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch venues:", error);
    return [];
  }
};

export const fetchVenueDetails = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/venues/${id}?_bookings=true`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch venue details:", error);
    return null;
  }
};
