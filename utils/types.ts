export type ItemType = "lost" | "found";
export type ItemStatus = "pending" | "active" | "claimed" | "solved" | "rejected";

export type BackendUserRef = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
};

export type Item = {
  _id: string;
  title: string;
  description: string;
  category: string;
  colour: string;
  type: ItemType;
  location: string;
  exactLocation: string;
  date: string; // ISO string (or YYYY-MM-DD)
  imageUrl?: string[] | string; // cloudinary urls (array) or legacy string
  brand?: string;
  model?: string;
  size?: string;
  uniqueMarks?: string;
  reward?: string;
  preferredContactMethod?: string;
  additionalNotes?: string;
  lastSeenLocation?: string;
  lastSeenTime?: string;
  foundLocation?: string;
  foundTime?: string;
  whereStored?: string;
  handoverLocation?: string;
  contactInfo?: { name?: string; email?: string; phone?: string };
  reportedBy?: BackendUserRef;
  status: ItemStatus;
  matchedItems?: Array<{ itemId: string; score: number }>;
  createdAt?: string;
  updatedAt?: string;
};

export type Notification = {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "match" | "claim" | "admin";
  isRead: boolean;
  createdAt: string;
};

export function itemId(item: { _id?: string; id?: string }) {
  return item._id || item.id || "";
}
