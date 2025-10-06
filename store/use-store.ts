// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// type User = {
//   id: string;
//   email: string;
//   username?: string;
//   role?: string;
// };

// type UserState = {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   setUser: (user: User | null) => void;
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;
// };

// export const useUserStore = create<UserState>()(
//   persist(
//     (set) => ({
//       user: null,
//       loading: false,
//       error: null,
//       setUser: (user) => set({ user }),
//       setLoading: (loading) => set({ loading }),
//       setError: (error) => set({ error }),
//     }),
//     {
//       name: "user-storage", // key di localStorage
//       partialize: (state) => ({ user: state.user }),
//       // ⬆️ hanya persist `user` saja (tidak persist loading/error)
//     },
//   ),
// );
