import { useState } from "react";
import { useForm } from "react-hook-form";
import DialogComponent from "./DialogComponent";
import { useUpdateContent } from "@/context/poll.provider";
import { toast } from "sonner";

type PollForm = {
  question: string;
  options: string;
  expiresAt: string;
};

const CreatePoll = () => {
  const { setUpdateContent } = useUpdateContent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PollForm>({
    defaultValues: {
      question: "",
      options: "Yes, No",
      expiresAt: new Date(new Date().getTime() + 10 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
    },
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    reset();
  };

  const onSubmit = async (data: PollForm) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        question: data.question,
        options: data.options.split(",").map((option) => option.trim()),
        expiresAt: new Date(data.expiresAt).toISOString(),
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/poll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (result.success) {
        closeDialog();
        setUpdateContent(true);
        toast.success("Poll created successfully!");
      } else {
        toast.error("Failed to create poll: " + result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the poll.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 md:px-8 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          <span className="text-blue-600">Vanish</span>Vote
        </h1>
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
        onClick={() => setIsDialogOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1.5"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create Poll
      </button>

      <DialogComponent
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title="Create New Poll"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Poll Question
            </label>
            <input
              type="text"
              {...register("question", {
                required: "Question is required",
                minLength: {
                  value: 5,
                  message: "Question must be at least 5 characters",
                },
              })}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="What would you like to ask?"
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-600">
                {errors.question.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Options (comma-separated)
            </label>
            <input
              type="text"
              {...register("options", {
                required: "Options are required",
                validate: (value) =>
                  value.split(",").filter((opt) => opt.trim()).length >= 2 ||
                  "At least 2 options are required",
              })}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Yes, No, Maybe"
            />
            {errors.options && (
              <p className="mt-1 text-sm text-red-600">
                {errors.options.message}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              Separate each option with a comma
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Expiration Date
            </label>
            <input
              type="datetime-local"
              {...register("expiresAt", {
                required: "Expiration date is required",
                validate: (value) => {
                  const currentTime = new Date();
                  const selectedTime = new Date(value);
                  const fiveMinutesFromNow = new Date(
                    currentTime.getTime() + 5 * 60 * 1000
                  );

                  if (selectedTime <= currentTime) {
                    return "Expiration date must be in the future";
                  }

                  if (selectedTime < fiveMinutesFromNow) {
                    return "Expiration date must be at least 5 minutes from now";
                  }

                  return true;
                },
              })}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm shadow-sm
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.expiresAt && (
              <p className="mt-1 text-sm text-red-600">
                {errors.expiresAt.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeDialog}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md font-medium transition-colors
                ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Poll"
              )}
            </button>
          </div>
        </form>
      </DialogComponent>
    </header>
  );
};

export default CreatePoll;
