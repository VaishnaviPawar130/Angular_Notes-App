export type Note = {
  id: string;
  text: string;
  createdAt: number;
  pinned: boolean;
  aiSummary?: string | null;
  isSummarizing?: boolean;
};
