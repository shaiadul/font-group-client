import LoadingPage from "@/components/global/LoadingPage";

export async function generateMetadata({ params }) {
  return {
    title: "Book Details",
  };
}

export default async function BookDetailsPage({ params }) {
  const res = await fetch(`https://gutendex.com/books/${params.id}`);
  const book = await res.json();

  const coverImage = `https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`;

  if (!book) {
    return <LoadingPage />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={coverImage || "https://via.placeholder.com/150"}
          alt={book.title}
          className="w-52 h-auto rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-semibold mb-2">{book.title}</h1>
          <p className="text-lg text-gray-700 mb-1">
            <span className="font-medium">Author:</span>{" "}
            {book.authors?.[0]?.name || "Unknown"}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-medium">ID:</span> {book.id}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Genres:</span>{" "}
            {book.subjects?.join(", ") || "N/A"}
          </p>
          <p className="text-gray-700 mb-2 text-sm">
            <span className="font-medium"><strong>Summary: </strong></span> {book.summaries}
          </p>
          <p className="text-sm text-gray-500 py-10">
            More details not available in the API. Visit Project Gutenberg for
            more info.
          </p>
        </div>
      </div>
    </div>
  );
}
