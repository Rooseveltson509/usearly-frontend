export interface FeedbackItem {
  emoji: string;
  description: string;
  user: {
    pseudo: string;
    avatar: string;
  };
}