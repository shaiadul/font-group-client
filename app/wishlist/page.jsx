"use client";

import LoadingPage from "@/components/global/LoadingPage";
import WishlistCard from "@/components/gutendex/WishlistCard";
import { useEffect, useState } from "react";

export default function Wishlist() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); 
    const books = JSON.parse(localStorage.getItem("wishlist") || "[]");
    // console.log("Wishlist IDs:", books);

    if (books.length > 0) {
      setBooks(books);
      setLoading(false);
    } else {
      setBooks([]);
      setLoading(false); 
    }
  }, []);
 const handleRemove = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };
  return (
    <div className="container mx-auto px-5">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Wishlist</h2>

      {loading ? (
        <LoadingPage />
      ) : books.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {books?.map((book, index) => (
            <WishlistCard key={index} book={book} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
