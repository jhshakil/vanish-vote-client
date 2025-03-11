export type TPollShow = {
  _id: string;
  question: string;
  options: string[];
  expiresAt: string; // ISO date string
  resultsVisible: boolean;
  createdAt: string; // ISO date string
  __v: number;
  totalVotes: number;
  results: {
    option: string;
    percentage: number;
  }[];
};
