import { create } from "zustand";

export type SiteSettings = {
  logoUrl?: string;
};

type SettingsStore = {
  settings: SiteSettings;
  setSettings: (s: SiteSettings) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {},
  setSettings: (settings) => set({ settings }),
}));
