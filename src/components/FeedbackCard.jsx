export default function FeedbackCard({ feedback }) {
  // Helper to capitalize first letter of each word
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="bg-white border-2 border-[#507b00] shadow-lg rounded-xl p-6 mb-6 transition-transform hover:scale-105 hover:shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        Name: {capitalizeWords(feedback.name)}
      </h3>
      <div className="mb-3">
        <span className="font-medium text-gray-700">Feedback:</span>
        <div
          className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700 max-h-40 overflow-y-auto whitespace-pre-line"
          style={{ resize: "none", minHeight: "60px" }}
        >
          {feedback.feedback}
        </div>
      </div>
      <p className="text-gray-600 mb-3">
        <span className="font-medium">Email:</span>{" "}
        {feedback.email && (
          <a
            href={`mailto:${feedback.email}`}
            className="text-blue-600 hover:underline"
          >
            {feedback.email}
          </a>
        )}
      </p>
      <p className="text-gray-600 mb-3">
        Date:{" "}
        {new Date(feedback.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </p>
    </div>
  );
}
