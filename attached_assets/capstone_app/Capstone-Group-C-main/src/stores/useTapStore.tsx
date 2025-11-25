import { storage } from "@/stores/storage";
import { create } from "zustand";

// Helpers
function getDateKey(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getDate() - offsetDays);
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function getTodayKey(hour?: number): string {
  const today = getDateKey(0);
  return hour !== undefined ? `${today}_${hour}` : today;
}

function getMonthKey(offsetMonths = 0): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() - offsetMonths);
  return d.toISOString().slice(0, 7); // "YYYY-MM"
}

export type TimelineOptions = "today" | "week" | "month" | "sixmonths" | "year";

// Types
interface TapState {
  count: number; // total taps today (local)
  unsynced: number; // taps since last Firebase sync
  addTap: () => void;
  reset: () => void;
  loadFromStorage: () => void;
  getTimeSeriesData: (
    type: TimelineOptions
  ) => { label: string; value: number }[];
  markSynced: () => void;
}

// Store
export const useTapStore = create<TapState>((set, get) => ({
  count: 0,
  unsynced: 0,

  addTap: () => {
    const { unsynced } = get();
    const hour = new Date().getHours();

    const todayKey = getTodayKey(); // daily total
    const hourKey = getTodayKey(hour); // hourly bucket
    const monthKey = getMonthKey(0); // monthly total

    // Increment hour
    const newHourCount = (storage.getNumber(hourKey) ?? 0) + 1;
    storage.set(hourKey, newHourCount);

    // Increment daily
    const newDayCount = (storage.getNumber(todayKey) ?? 0) + 1;
    storage.set(todayKey, newDayCount);

    // Increment monthly
    const newMonthCount = (storage.getNumber(monthKey) ?? 0) + 1;
    storage.set(monthKey, newMonthCount);

    // Update zustand state
    set({ count: newDayCount, unsynced: unsynced + 1 });

    // Persist unsynced counter
    storage.set("unsynced", unsynced + 1);
  },

  reset: () => {
    set({ count: 0, unsynced: 0 });
    storage.set("unsynced", 0);
  },

  loadFromStorage: () => {
    const todayKey = getTodayKey();
    const todayTotal = storage.getNumber(todayKey) ?? 0;
    const unsynced = storage.getNumber("unsynced") ?? 0;
    set({ count: todayTotal, unsynced });
  },

  getTimeSeriesData: (type) => {
    const data: { label: string; value: number }[] = [];

    switch (type) {
      case "today":
        for (let i = 0; i < 24; i++) {
          const hKey = getTodayKey(i);

          let label = "";
          if (i === 0) label = "12 AM";
          else if (i === 6) label = "6 AM";
          else if (i === 12) label = "12 PM";
          else if (i === 18) label = "6 PM";

          data.push({ label, value: storage.getNumber(hKey) ?? 0 });
        }
        break;

      case "week": {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0=Sun, 6=Sat (local!)
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - dayOfWeek); // rewind to local Sunday

        for (let i = 0; i < 7; i++) {
          const d = new Date(sunday);
          d.setDate(sunday.getDate() + i); // step forward in local time

          const dayKey = d.toISOString().split("T")[0]; // still fine for keys
          const label = d.toLocaleDateString("en-US", { weekday: "short" }); // Sun, Mon, ...
          data.push({ label, value: storage.getNumber(dayKey) ?? 0 });
        }
        break;
      }

      case "month": {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0=Jan

        // how many days in this month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const d = new Date(year, month, day);
          const dayKey = d.toISOString().split("T")[0];

          // Label only every other day
          const label = day % 2 === 0 ? String(day) : "";

          data.push({
            label,
            value: storage.getNumber(dayKey) ?? 0,
          });
        }
        break;
      }

      case "sixmonths": {
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthKey = d.toISOString().slice(0, 7); // YYYY-MM
          const label = d.toLocaleDateString("en-US", { month: "short" }); // Jan, Feb, ...

          data.push({
            label, // e.g. "Mar"
            value: storage.getNumber(monthKey) ?? 0,
          });
        }
        break;
      }

      case "year": {
        const today = new Date();
        const year = today.getFullYear();

        for (let month = 0; month < 12; month++) {
          const d = new Date(year, month, 1);
          const monthKey = d.toISOString().slice(0, 7); // "YYYY-MM"

          // Short month name (Jan, Feb, Mar...)
          const label = d.toLocaleDateString("en-US", { month: "short" });

          data.push({
            label,
            value: storage.getNumber(monthKey) ?? 0,
          });
        }
        break;
      }
    }

    return data;
  },

  markSynced: () => {
    set({ unsynced: 0 });
    storage.set("unsynced", 0);
  },
}));

// Selectors
export const useTapCount = () => useTapStore((state) => state.count);
export const useAddTap = () => useTapStore((state) => state.addTap);
export const useLoadFromStorage = () =>
  useTapStore((state) => state.loadFromStorage);
export const useGetTimeSeriesData = () =>
  useTapStore((state) => state.getTimeSeriesData);
