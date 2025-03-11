import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

type Poll = {
  _id: string;
  question: string;
  options: string[];
  expiresAt: string;
};

const ViewVote = () => {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!id) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/poll/${id}`
        );
        if (!response.ok) {
          throw new Error("Poll not found");
        }
        const data = await response.json();

        if (data.success) {
          setPoll(data.data);

          const currentDate = new Date();
          const expiresAtDate = new Date(data.data.expiresAt);
          setIsExpired(expiresAtDate <= currentDate);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const handleVote = async (choice: string) => {
    if (!poll) return;
    const currentDate = new Date();
    const expiresAtDate = new Date(poll?.expiresAt);
    setIsExpired(expiresAtDate <= currentDate);
    if (expiresAtDate <= currentDate) {
      toast.error("Time is up! Voting is closed.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pollId: id, choice }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }

      toast.success("Vote submitted successfully!");
    } catch (err: any) {
      console.error(err.message);
      toast.error("Error submitting vote: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Error</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          {poll?.question}
        </h2>

        {isExpired ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <div className="flex justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-700 font-medium">This poll has expired</p>
            <p className="text-red-600 text-sm mt-1">
              Voting is no longer available
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {poll?.options?.map((option) => (
              <button
                key={option}
                className="w-full bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-800 font-medium py-3 px-4 rounded-md transition-colors duration-200 text-center"
                onClick={() => handleVote(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-slate-500">
          {!isExpired && <p>Click on an option to cast your vote</p>}
        </div>
      </div>
    </div>
  );
};

export default ViewVote;
