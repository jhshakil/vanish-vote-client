import PollShowCard from "@/components/PollShowCard";
import { useUpdateContent } from "@/context/poll.provider";
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
  const { updateContent, setUpdateContent } = useUpdateContent();

  const [allPoll, setAllPoll] = useState<TPollShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      const data = await getAllPoll();
      if (data.success) {
        setAllPoll(data.data);
        setLoading(false);
        setUpdateContent(false);
      }
    };

    fetchPoll();
  }, [updateContent]);

  if (loading) return <p>Loading Poll Results...</p>;
  if (!allPoll?.length) return <p>No Poll Found</p>;

  return (
    <div className="container px-4 py-2 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {allPoll?.map((poll: TPollShow) => (
          <PollShowCard key={poll._id} {...poll} />
        ))}
      </div>
    </div>
  );
};

export default Home;
