"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookCard({ book }) {
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
    } else {
      parsed.push(book);
    }

    localStorage.setItem("wishlist", JSON.stringify(parsed));
    setWishlisted(!wishlisted);
  };
  const coverImage = `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`;

  return (
    <Link href={`/gutendex/${book.id}`} className="border border-gray-300 rounded shadow hover:shadow-xl relative cursor-pointer">
      <img
        src={coverImage || "https://via.placeholder.com/150"}
        alt={book.title}
        className="w-full h-60 object-cover rounded-t mb-4"
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
          onClick={toggleWishlist}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
      </div>
    </Link>
  );
}
