"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, browserLocalPersistence, indexedDBLocalPersistence, type Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirebaseEnv, isFirebaseConfigured } from "./config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(getFirebaseEnv());
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!auth) {
    try { auth = initializeAuth(a, { persistence: [browserLocalPersistence, indexedDBLocalPersistence] }); }
    catch (error) {
      if ((error as { code?: string }).code !== "auth/already-initialized") throw error;
      auth = getAuth(a);
    }
  }
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  const a = getFirebaseApp();
  if (!a) return null;
  if (!db) {
    try {
      db = initializeFirestore(a, { experimentalForceLongPolling: true, experimentalLongPollingOptions: { timeoutSeconds: 25 } });
    } catch (error) {
      if ((error as { code?: string }).code !== "failed-precondition") throw error;
      db = getFirestore(a);
    }
  }
  return db;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const a = getFirebaseApp();
  return a ? getStorage(a) : null;
}
