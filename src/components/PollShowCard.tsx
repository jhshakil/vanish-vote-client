import { TPollShow } from "@/types";
import { useState } from "react";
import DialogComponent from "./DialogComponent";

const hasPollExpired = (expiresAt: string): boolean => {
  const currentDate = new Date();
  const expiresAtDate = new Date(expiresAt);
  return expiresAtDate >= currentDate;
};

const PollShowCard = ({
  _id,
  question,
  expiresAt,
  totalVotes,
  results,
}: TPollShow) => {
  const isActive = hasPollExpired(expiresAt);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const shareableUrl = `${window.location.origin}/poll/${_id}`;

  const closeDialog = () => setIsDialogOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy the URL: ", error);
      });
  };

  return (
    <div className="border border-slate-800 rounded p-4">
      <h2 className="text-lg font-medium">{question}</h2>

      {isActive ? (
        <div className="mt-3 flex justify-end">
          <button
            className="px-4 py-2 rounded bg-blue-800 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            Share
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <p className="text-lg">Results: Total Vote {totalVotes}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {results.map(({ option, percentage }) => (
              <div
                key={option}
                className={`px-3 py-2 rounded text-white ${
                  option === "Yes" ? "bg-green-800" : "bg-red-800"
                }`}
              >
                <p>
                  {option}: <span>{percentage.toFixed(2)}%</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <DialogComponent
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title="Share Poll"
      >
        <p className="mb-4">Share this poll using the link below:</p>
        <input
          type="text"
          value={shareableUrl}
          readOnly
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          className="px-4 py-2 rounded bg-blue-800 text-white"
          onClick={copyToClipboard}
        >
          Copy URL
        </button>
      </DialogComponent>
    </div>
  );
};

export default PollShowCard;
