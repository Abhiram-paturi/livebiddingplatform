import { useState, useEffect } from 'react';

export function Countdown({ endsAt }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const diff = endsAt - now;

            if (diff <= 0) {
                setTimeLeft("Auction Ended");
                clearInterval(timer);
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [endsAt]);

    return <span>{timeLeft || "Loading..."}</span>;
}
