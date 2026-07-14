import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import type { Order } from "@/types";

const COLLECTION_NAME = "orders";

export async function getOrders(): Promise<Order[]> {
  const db = getFirebaseDb();
  if (!db) return [];
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Order;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOrder(id: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase DB not initialized");
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
