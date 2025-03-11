const VoteCard = () => {
  return (
    <div className="border border-slate-800 rounded p-4">
      <h2 className="text-lg font-medium">Test Poll</h2>
      <div className="mt-4 flex justify-between items-center">
        <button className="bg-green-800 px-5 py-2 rounded text-white">
          Yes
        </button>
        <button className="bg-red-800 px-5 py-2 rounded text-white">No</button>
      </div>
    </div>
  );
};

export default VoteCard;
