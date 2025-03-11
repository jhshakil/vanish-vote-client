import { useState } from "react";
import { useForm } from "react-hook-form";
import DialogComponent from "./DialogComponent";

type PollForm = {
  question: string;
  options: string;
  expiresAt: string;
};

const CreatePoll = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<PollForm>({
    defaultValues: {
      question: "",
      options: "yes, no",
      expiresAt: new Date().toISOString().slice(0, 16),
    },
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    reset(); // Reset form fields on close
  };

  const onSubmit = async (data: PollForm) => {
    try {
      // Split options by comma and trim spaces to create an array of strings
      const formattedData = {
        question: data.question,
        options: data.options.split(",").map((option) => option.trim()),
        expiresAt: new Date(data.expiresAt).toISOString(),
      };

      console.log(formattedData);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/poll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (result.success) {
        // Close dialog after submitting successfully
        closeDialog();
        alert("Poll created successfully!"); // Optional: Show a success message
      } else {
        alert("Failed to create poll: " + result.message); // Handle failure
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the poll.");
    }
  };

  return (
    <div className="flex justify-end py-5 px-11 border-b border-slate-800">
      <button
        className="bg-slate-600 text-white px-4 py-2 rounded"
        onClick={() => setIsDialogOpen(true)}
      >
        Create Poll
      </button>
      <DialogComponent
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title="Create Poll"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Poll Question:</label>
            <input
              type="text"
              {...register("question", { required: true })}
              className="border border-slate-300 rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Options (comma-separated):</label>
            <input
              type="text"
              {...register("options", { required: true })}
              className="border border-slate-300 rounded px-2 py-1 w-full"
              placeholder="e.g., yes, no"
            />
          </div>
          <div>
            <label className="block mb-1">Expiration Date:</label>
            <input
              type="datetime-local"
              {...register("expiresAt", { required: true })}
              className="border border-slate-300 rounded px-2 py-1 w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-slate-600 text-white px-4 py-2 rounded"
            >
              Create Poll
            </button>
          </div>
        </form>
      </DialogComponent>
    </div>
  );
};

export default CreatePoll;
