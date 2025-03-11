import PollShowCard from "@/components/PollShowCard";
import VoteCard from "@/components/VoteCard";

const Home = () => {
  return (
    <div className="container px-4 py-2 mt-8">
      <div className="grid grid-cols-5 gap-8">
        <PollShowCard />
        <VoteCard />
      </div>
    </div>
  );
};

export default Home;
