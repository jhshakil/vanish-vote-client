import type { TPollShow } from "@/types";
import { useState } from "react";
import DialogComponent from "./DialogComponent";
import { toast } from "sonner";

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
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const shareableUrl = `${window.location.origin}/poll/${_id}`;

  const closeShareDialog = () => setIsShareDialogOpen(false);
  const closeResultsDialog = () => setIsResultsDialogOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => {
        toast.success("URL copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy the URL: ", error);
      });
  };

  return (
    <div className="bg-white  rounded-lg border border-slate-200  shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
      <h2 className="text-lg font-medium text-slate-900 mb-4">{question}</h2>

      {isActive ? (
        <div className="mt-auto flex justify-end">
          <button
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setIsShareDialogOpen(true)}
          >
            Share
          </button>
        </div>
      ) : (
        <div className="mt-auto flex justify-end">
          <button
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            onClick={() => setIsResultsDialogOpen(true)}
          >
            Show Results
          </button>
        </div>
      )}

      {/* Share Dialog */}
      <DialogComponent
        isOpen={isShareDialogOpen}
        onClose={closeShareDialog}
        title="Share Poll"
      >
        <p className="mb-4 text-slate-700">
          Share this poll using the link below:
        </p>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={shareableUrl}
            readOnly
            className="w-full p-2.5 border border-slate-300 rounded-md bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="px-4 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={copyToClipboard}
          >
            Copy
          </button>
        </div>
      </DialogComponent>

      {/* Results Dialog */}
      <DialogComponent
        isOpen={isResultsDialogOpen}
        onClose={closeResultsDialog}
        title="Poll Results"
      >
        <p className="text-lg mb-4 font-medium text-slate-900">
          Total Votes: <span className="font-bold">{totalVotes}</span>
        </p>
        <div className="space-y-4">
          {results.map(({ option, percentage }) => (
            <div key={option} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-800">{option}</p>
                <p className="font-bold text-slate-900">
                  {percentage.toFixed(1)}%
                </p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </DialogComponent>
    </div>
  );
};

export default PollShowCard;
