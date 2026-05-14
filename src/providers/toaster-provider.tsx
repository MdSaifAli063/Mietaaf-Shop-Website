"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className:
          "!bg-card !text-card-foreground !border !border-border !shadow-xl !rounded-lg",
        duration: 3200,
      }}
    />
  );
}
