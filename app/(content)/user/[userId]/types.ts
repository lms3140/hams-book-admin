export type TabType = "INFO" | "ORDER" | "REVIEW";

export interface Member {
  memberId: number;
  userId: string;
  name: string;
  email: string;
  status: string;
  pointBalance: number;
  createdAt: string;
}

export interface MemberHistory {
  historyId: number;
  type: "POINT" | "STATUS";
  beforeValue: string;
  afterValue: string;
  reason: string;
  createdAt: string;
}

export interface Order {
  orderId: number;
  orderStatus: string;
  paidAt: string;
  items: {
    title: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface Review {
  reviewId: number;
  title: string;
  rating: number;
  content: string;
  createdAt: string;
}
