"use client";
import { Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import BookCard from "@/components/gutendex/BookCard";
import LoadingPage from "@/components/global/LoadingPage";

export default function GutendexPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const genres = ["Fiction", "Science", "History", "Fantasy", "Horror"];

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const res = await fetch(`https://gutendex.com/books?page=${page}`);
      const data = await res.json();
      setBooks(data.results);
      setLoading(false);
    };
    fetchBooks();
  }, [page]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) &&
      (genre ? book.subjects?.some((sub) => sub.includes(genre)) : true)
  );

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto px-5 py-8 gap-5">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books by title..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="relative w-full md:w-40">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-xl">Loading books...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center space-x-2 mt-8">
        {/* Prev Button */}
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md border transition
      ${
        page === 1
          ? "border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100"
          : "border-emerald-500 text-emerald-600 hover:bg-emerald-50"
      }`}
        >
          Prev
        </button>

        {/* Numbered Pages */}
        {[...Array(5)].map((_, idx) => {
          const pageNumber = page - 2 + idx;
          if (pageNumber < 1) return null;
          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-4 py-2 rounded-md border transition
          ${
            pageNumber === page
              ? "bg-emerald-600 text-white border-emerald-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-md border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
