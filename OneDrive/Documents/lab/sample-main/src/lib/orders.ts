import type { Order, OrderStatus } from "@/types/order";
import { loadJsonFile, getPersistentData, setPersistentData } from "./storage";
import { generateDeliveryToken } from "./delivery";

const ORDERS_KEY = "orders";
const ORDERS_FILE = "orders.json";

const globalForOrders = globalThis as unknown as { __ORDERS_STORE__?: Order[] };
if (!globalForOrders.__ORDERS_STORE__) {
  globalForOrders.__ORDERS_STORE__ = loadJsonFile<Order[]>(ORDERS_FILE, []);
}

async function getOrdersStore(): Promise<Order[]> {
  const orders = await getPersistentData<Order[]>(ORDERS_KEY, []);
  globalForOrders.__ORDERS_STORE__ = orders;
  return orders;
}

async function persistOrders(orders: Order[]) {
  globalForOrders.__ORDERS_STORE__ = orders;
  await setPersistentData(ORDERS_KEY, orders);
}

export async function getAllOrders(): Promise<Order[]> {
  const store = await getOrdersStore();
  return [...store];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const store = await getOrdersStore();
  const order = store.find((o) => o.id === id);
  return order ? { ...order } : null;
}

export async function getOrderByDownloadToken(token: string): Promise<Order | null> {
  const store = await getOrdersStore();
  const order = store.find((o) => o.downloadToken === token);
  return order ? { ...order } : null;
}

export async function incrementDownloadCount(id: string): Promise<number> {
  const store = await getOrdersStore();
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) return 0;
  store[index].downloadCount = (store[index].downloadCount || 0) + 1;
  await persistOrders(store);
  return store[index].downloadCount;
}

export async function createOrder(data: Partial<Order>): Promise<Order> {
  const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: newId,
    productId: data.productId || "prod_01",
    productSlug: data.productSlug || "master-ai-in-28-days",
    productTitle: data.productTitle || "Master AI in 28 Days",
    customerEmail: data.customerEmail || "",
    customerName: data.customerName || "Customer",
    customerPhone: data.customerPhone || "",
    amount: data.amount ?? 9900,
    currency: data.currency || "INR",
    status: data.status || "PENDING",
    paymentMethod: data.paymentMethod || "Manual UPI",
    downloadCount: 0,
    downloadToken: generateDeliveryToken(newId),
    createdAt: now,
  };

  const store = await getOrdersStore();
  store.unshift(newOrder);
  await persistOrders(store);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const store = await getOrdersStore();
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], status };
  await persistOrders(store);
  return store[index];
}

/** Submit customer payment proof (UTR and screenshot) */
export async function submitPaymentProof(
  id: string,
  paymentReference: string,
  paymentProofUrl?: string
): Promise<Order | null> {
  const store = await getOrdersStore();
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) return null;
  const updated: Order = {
    ...store[index],
    status: "PENDING_PAYMENT_VERIFICATION",
    paymentReference,
    paymentProofUrl,
    paymentSubmittedAt: new Date().toISOString(),
  };
  store[index] = updated;
  await persistOrders(store);
  return updated;
}

/** Admin approval of manual payment */
export async function verifyAndApproveOrder(id: string): Promise<Order | null> {
  const store = await getOrdersStore();
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) return null;
  const current = store[index];
  const updated: Order = {
    ...current,
    status: "PAID",
    downloadToken: current.downloadToken || generateDeliveryToken(id),
  };
  store[index] = updated;
  await persistOrders(store);
  return updated;
}

/** Admin marks order as DELIVERED */
export async function markOrderDelivered(id: string): Promise<Order | null> {
  return updateOrderStatus(id, "DELIVERED");
}

/** Admin rejects/cancels an order */
export async function rejectOrder(id: string): Promise<Order | null> {
  return updateOrderStatus(id, "REJECTED");
}
