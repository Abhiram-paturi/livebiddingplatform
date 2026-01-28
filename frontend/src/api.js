export async function fetchItems() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const response = await fetch(`${backendUrl}/items`);
    return response.json();
}