import { useState, useEffect, useCallback, useRef } from "react";
import { fetchItems } from "../api";
import { io } from "socket.io-client";



export function useAuctionItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initial fetch via REST API
        async function loadItems() {
            try {
                const data = await fetchItems();
                setItems(data);
            } catch (err) {
                setError("Failed to load auctions");
            } finally {
                setLoading(false);
            }
        }
        loadItems();

        // Setup Socket.io
        const socket = io(process.env.REACT_APP_BACKEND_URL);
        socketRef.current = socket;

        socket.on("INITIAL_DATA", (data) => {
            setUserId(data.userId);
            // Optional: sync items again from socket initial data
            // setItems(data.items);
        });

        socket.on("UPDATE_BID", (data) => {
            console.log("Real-time update received:", data);
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === data.itemId
                        ? { ...item, currentBid: data.currentBid, highestBidder: data.highestBidder }
                        : item
                )
            );
        });

        socket.on("BID_ERROR", (data) => {
            console.log("Bid Error Received:", data);
            // We'll update the item with an error message temporarily
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === data.itemId
                        ? { ...item, error: data.message }
                        : item
                )
            );
            // Clear the error after 3 seconds
            setTimeout(() => {
                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === data.itemId ? { ...item, error: null } : item
                    )
                );
            }, 3000);
        });

        socket.on("AUCTIONS_RESET", (data) => {
            console.log("Auctions have been reset!");
            setItems(data.items);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const placeBid = useCallback((itemId, amount) => {
        if (socketRef.current) {
            socketRef.current.emit("BID_PLACED", { itemId, amount });
        }
    }, []);

    return { items, userId, loading, error, placeBid };
}