import { useState, useEffect, useRef } from 'react';

export function useAuctionFlash(currentBid, isWinning, error) {
    const [flash, setFlash] = useState(null);
    const prevBid = useRef(currentBid);
    const wasWinning = useRef(isWinning);

    useEffect(() => {
        // If there is an item-specific error (like "Outbid"), flash red
        if (error) {
            setFlash("red");
            const timer = setTimeout(() => setFlash(null), 1000);
            return () => clearTimeout(timer);
        }

        // If price increased
        if (currentBid > prevBid.current) {
            // RED FLASH: Only for the person who WAS winning and just lost their lead
            if (wasWinning.current && !isWinning) {
                setFlash("red");
            }
            // GREEN FLASH: For everyone else (successful price increase)
            else {
                setFlash("green");
            }

            const timer = setTimeout(() => setFlash(null), 1000);
            prevBid.current = currentBid;
            wasWinning.current = isWinning;
            return () => clearTimeout(timer);
        }

        // Always sync the winning status for the next update
        wasWinning.current = isWinning;
    }, [currentBid, isWinning, error]);

    return flash;
}
