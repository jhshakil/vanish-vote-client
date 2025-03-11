import PollShowCard from "@/components/PollShowCard";
import { TPollShow } from "@/types";
import { useEffect, useState } from "react";

const getAllPoll = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/poll`);
    if (!response.ok) {
      throw new Error("Failed to fetch poll results");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const Home = () => {
  const [allPoll, setAllPoll] = useState<TPollShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      const data = await getAllPoll();
      if (data.success) setAllPoll(data.data);
      setLoading(false);
    };

    fetchPoll();
  }, []);

  if (loading) return <p>Loading poll results...</p>;

  return (
    <div className="container px-4 py-2 mt-8">
      <div className="grid grid-cols-5 gap-8">
        {allPoll?.map((poll: TPollShow) => (
          <PollShowCard key={poll._id} {...poll} />
        ))}
      </div>
    </div>
  );
};

export default Home;
