const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { getAuctions, placeBid } = require("./Auctions");
const AUCTION_DURATION = 5 * 60 * 1000;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.get("/", (req, res) => {
    res.json(getAuctions());
});

app.get("/items", (req, res) => {
    const auctions = getAuctions();
    const now = Date.now();

    auctions.forEach((a) => {
        // If it hasn't started yet, or if it already ended, reset it to start now
        if (!a.startsAt || now > a.endsAt) {
            a.startsAt = now;
            a.endsAt = now + AUCTION_DURATION;
            a.currentBid = a.startingPrice;
            a.highestBidder = null;
        }
    });

    res.json(auctions);
});

app.post("/reset", (req, res) => {
    const auctions = getAuctions();
    auctions.forEach(a => {
        a.startsAt = null;
        a.endsAt = null;
        a.highestBidder = null;
        a.currentBid = a.startingPrice;
    });

    // Broadcast to all clients so their UI updates immediately
    io.emit("AUCTIONS_RESET", { items: auctions });

    res.json({ message: "Auctions reset" });
});


io.on("connection", (socket) => {
    console.log("User Connected: ", socket.id);

    // Send initial data to the connected user
    socket.emit("INITIAL_DATA", {
        userId: socket.id,
        items: getAuctions(),
    });

    socket.on("BID_PLACED", (data) => {
        console.log("Bid from :", socket.id, data);
        const { itemId, amount } = data;

        // The logic in Auctions.js handles the race condition by checking if amount > currentBid
        const result = placeBid(itemId, amount, socket.id);

        if (!result.success) {
            console.log("Bid Error:", result.error);
            socket.emit("BID_ERROR", { itemId, message: result.error });
            return;
        }

        console.log("New highest bid accepted!");
        // Broadcast the update to everyone
        io.emit("UPDATE_BID", {
            itemId,
            currentBid: result.auction.currentBid,
            highestBidder: result.auction.highestBidder,
        });
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})