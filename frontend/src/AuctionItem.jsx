import { useState, useEffect } from 'react';
import { Countdown } from './Countdown';
import { useAuctionFlash } from './hooks/useAuctionFlash';

export function AuctionItem({ item, userId, onBid }) {
    const [isEnded, setIsEnded] = useState(new Date(item.endsAt) <= new Date());
    const isWinning = item.highestBidder === userId;

    useEffect(() => {
        // If not ended yet, set a timer to flip the state exactly when it ends
        const timeLeft = new Date(item.endsAt).getTime() - Date.now();
        if (timeLeft > 0) {
            const timer = setTimeout(() => setIsEnded(true), timeLeft);
            return () => clearTimeout(timer);
        } else {
            setIsEnded(true);
        }
    }, [item.endsAt]);

    // Use our simplified custom hook for visual effects
    const flash = useAuctionFlash(item.currentBid, isWinning, item.error);

    const handleBid = () => {
        onBid(item.id, item.currentBid + 10);
    };

    return (
        <div className={`card ${flash ? `flash-${flash}` : ""} ${isEnded ? "ended" : ""}`}>
            <h3>{item.title}</h3>
            <p className="price">Current Bid: ₹{item.currentBid}</p>

            <div className="timer">
                {isEnded ? "Auction Closed" : (
                    <>Time Left: <Countdown endsAt={item.endsAt} /></>
                )}
            </div>

            {isEnded ? (
                isWinning ? (
                    <div className="badge final-winner">🎉 YOU ARE THE WINNER! 🏆</div>
                ) : (
                    <div className="badge sold">
                        Winner: {item.highestBidder ? `User ${item.highestBidder.slice(0, 5)}` : "No Bids"}
                    </div>
                )
            ) : (
                <>
                    {isWinning && <div className="badge winning">You are currently winning! 🏆</div>}
                    {item.error && <div className="badge error-msg">{item.error}</div>}
                </>
            )}

            <button onClick={handleBid} className="bid-btn" disabled={isEnded}>
                {isEnded ? "Auction Ended" : "Bid +₹10"}
            </button>
        </div>
    );
}
