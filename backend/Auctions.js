const Auctions = [
  {
    id: "1",
    title: "iPhone 15",
    startingPrice: 500,
    currentBid: 500,
    highestBidder: null,
    startsAt: null,
    endsAt: null
  },
  {
    id: "2",
    title: "MacBook Pro",
    startingPrice: 1200,
    currentBid: 1200,
    highestBidder: null,
    startsAt: null,
    endsAt: null
  },
  {
    id: "3",
    title: "Sony PlayStation 5",
    startingPrice: 500,
    currentBid: 500,
    highestBidder: null,
    startsAt: null,
    endsAt: null
  }
];


function getAuctions() {
  return Auctions;
}

function getAuctionById(id) {
  return Auctions.find(a => a.id === id);
}


function placeBid(itemId, amount, bidderId) {
  const auction = Auctions.find((a) => a.id === itemId);

  if (!auction) {
    return { success: false, error: "Item not found" };
  }

  const now = Date.now();
  if (now > auction.endsAt) {
    return { success: false, error: "Auction has already ended" };
  }

  // The condition for a valid bid is that it must be strictly higher than the current bid
  if (amount <= auction.currentBid) {
    return { success: false, error: "Outbid" };
  }

  // Update auction state
  auction.currentBid = amount;
  auction.highestBidder = bidderId;

  return {
    success: true,
    auction: auction,
  };
}
module.exports = {
  getAuctions,
  getAuctionById,
  placeBid
};
