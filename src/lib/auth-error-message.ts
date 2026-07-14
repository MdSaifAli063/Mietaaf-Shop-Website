import { FirebaseError } from "firebase/app";

const messages: Record<string, string> = {
  "auth/email-already-in-use": "An account already exists for this email. Try signing in instead.",
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/network-request-failed": "We could not connect. Check your internet connection and try again.",
  "auth/popup-blocked": "Your browser blocked the Google sign-in window. Allow popups and try again.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled before it finished.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment before trying again.",
  "auth/user-disabled": "This account has been disabled. Contact support for help.",
  "auth/weak-password": "Choose a stronger password with at least 6 characters.",
};

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FirebaseError) return messages[error.code] ?? fallback;
  return fallback;
}
