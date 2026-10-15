/** Order status for manual creator fulfillment workflow */
export type OrderStatus =
  | "PENDING"
  | "PENDING_PAYMENT_VERIFICATION"
  | "PAID"
  | "DELIVERED"
  | "REJECTED";

export interface Order {
  id: string;
  productId: string;
  productSlug: string;
  productTitle: string;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  /** Amount in paise */
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: string;
  /** Manual payment verification fields */
  paymentReference?: string;
  paymentProofUrl?: string;
  paymentSubmittedAt?: string;
  downloadCount: number;
  downloadToken: string;
  createdAt: string;
}

export interface CheckoutFormData {
  email: string;
  phone?: string;
  name: string;
}
