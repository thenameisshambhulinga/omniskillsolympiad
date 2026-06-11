export type PublicActivityType =
  | "identity"
  | "challenge"
  | "streak"
  | "points"
  | "rank"
  | "achievement";

export type PublicActivity = {
  id: string;
  title: string;
  description: string;
  type: PublicActivityType;
  createdAt: string;
};
