import './App.css'
import { useAuctionItems } from './hooks/useAuctionItems'
import { AuctionItem } from './AuctionItem';

function App() {
   const { items, userId, loading, error, placeBid } = useAuctionItems();

   if (loading) return <div className="loading">Loading auctions...</div>;
   if (error) return <div className="error">{error}</div>;

   return (
      <div className="container">
         <header>
            <h1>⚡ Live Bidding Platform</h1>
            <p className="subtitle">Compete in real-time for the best items!</p>
         </header>

         <div className="grid">
            {items.map((item) => (
               <AuctionItem
                  key={item.id}
                  item={item}
                  userId={userId}
                  onBid={placeBid}
               />
            ))}
         </div>
      </div>
   );
}

export default App;
