const PollShowCard = () => {
  return (
    <div className="border border-slate-800 rounded p-4">
      <h2 className="text-lg font-medium">Test Poll</h2>
      <div className="mt-3">
        <p className="text-lg">result:</p>
        <div className="mt-2 flex justify-between items-center">
          <div className="bg-green-800 px-3 py-2 rounded text-white">
            <p>
              Yes: <span>45%</span>
            </p>
          </div>
          <div className="bg-red-800 px-3 py-2 rounded text-white">
            <p>
              No: <span>55%</span>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button className="px-4 py-2 rounded bg-blue-800 text-white">
          Share
        </button>
      </div>
    </div>
  );
};

export default PollShowCard;
