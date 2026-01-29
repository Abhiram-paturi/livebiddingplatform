export async function fetchItems() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
    const response = await fetch(`${backendUrl}/items`);
    return response.json();
}