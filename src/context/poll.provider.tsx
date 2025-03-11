import { createContext, useContext, useState, ReactNode } from "react";

interface TPollProviderValues {
  updateContent: boolean;
  setUpdateContent: (value: boolean) => void;
}

const PollContext = createContext<TPollProviderValues | undefined>(undefined);

const PollProvider = ({ children }: { children: ReactNode }) => {
  const [updateContent, setUpdateContent] = useState<boolean>(true);

  return (
    <PollContext.Provider value={{ updateContent, setUpdateContent }}>
      {children}
    </PollContext.Provider>
  );
};

export const useUpdateContent = () => {
  const context = useContext(PollContext);

  if (!context) {
    throw new Error("useUpdateContent must be used within a PollProvider");
  }

  return context;
};

export default PollProvider;
