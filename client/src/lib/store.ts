import { create } from 'zustand';

interface SidebarState {
    isOpen: boolean;
    toggle: () => void;
    setOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isOpen: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    setOpen: (open) => set({ isOpen: open }),
}));

interface UserState {
    user: any;
    setUser: (user: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
})); 