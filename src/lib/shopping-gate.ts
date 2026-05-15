/**
 * Synchronous gate for cart / wishlist / compare mutations.
 * Synced from AuthProvider each render so the first paint matches session state
 * (no one-frame window where guests can add before effects run).
 */
let shoppingOpen = false;

export function syncShoppingGate(input: {
  firebaseReady: boolean;
  loading: boolean;
  hasUser: boolean;
}): void {
  if (!input.firebaseReady) {
    shoppingOpen = true;
    return;
  }
  if (input.loading) {
    shoppingOpen = false;
    return;
  }
  shoppingOpen = input.hasUser;
}

export function isShoppingOpen(): boolean {
  return shoppingOpen;
}
