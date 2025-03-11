import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    if (isExpired) {
      alert("Time is up! Voting is closed.");
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

      alert("Vote submitted successfully!");
    } catch (err: any) {
      console.error(err.message);
      alert("Error submitting vote: " + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="border border-slate-800 rounded p-4 min-w-[400px]">
        <h2 className="text-lg font-medium">{poll?.question}</h2>
        {isExpired ? (
          <p className="text-red-600">Time Expired</p>
        ) : (
          <div className="mt-4 flex justify-between items-center">
            {poll?.options?.map((option) => (
              <button
                key={option}
                className="border border-slate-700 px-5 py-2 rounded uppercase"
                onClick={() => handleVote(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewVote;
