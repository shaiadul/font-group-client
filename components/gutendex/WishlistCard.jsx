"use client";

import { useEffect, useState } from "react";

export default function WishlistCard({ book, onRemove }) {
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist") || "[]";
    const parsed = JSON.parse(stored);
    setWishlisted(parsed.some((b) => b.id === book.id));
  }, [book.id]);

  const toggleWishlist = () => {
    const stored = localStorage.getItem("wishlist") || "[]";
    let parsed = JSON.parse(stored);

    if (wishlisted) {
      parsed = parsed.filter((b) => b.id !== book.id);
      localStorage.setItem("wishlist", JSON.stringify(parsed));
      setWishlisted(false);
      if (onRemove) onRemove(book.id);  // Notify parent
    } else {
      parsed.push(book);
      localStorage.setItem("wishlist", JSON.stringify(parsed));
      setWishlisted(true);
    }
  };

  const coverImage = `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`;

  return (
    <div className="border border-gray-300 rounded shadow hover:shadow-xl relative cursor-pointer">
      <img
        src={coverImage}
        alt={book.title}
        className="w-full h-60 object-cover rounded-t mb-4"
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
      />
      <div className="px-5">
        <h3 className="font-bold text-lg line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3 py-1">
          {book.authors?.map((a) => a.name).join(", ")}
        </p>
        <p className="text-xs text-gray-400 py-2">
          Genres: {book.subjects?.slice(0, 2).join(", ")}
        </p>

        <button
          className="absolute top-2 right-2 text-xl"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist();
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}
