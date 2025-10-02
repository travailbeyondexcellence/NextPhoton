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

// Combined store for all app state
interface AppState {
    // Secondary Sidebar Drawer state
    isSecondarySidebarOpen: boolean;
    secondarySidebarContent: string | null;
    openSecondarySidebar: (content: string) => void;
    closeSecondarySidebar: () => void;
    toggleSecondarySidebar: (content?: string) => void;
}

export const useStore = create<AppState>((set) => ({
    // Secondary Sidebar Drawer state
    isSecondarySidebarOpen: false,
    secondarySidebarContent: null,
    openSecondarySidebar: (content) => set({ 
        isSecondarySidebarOpen: true, 
        secondarySidebarContent: content 
    }),
    closeSecondarySidebar: () => set({ 
        isSecondarySidebarOpen: false, 
        secondarySidebarContent: null 
    }),
    toggleSecondarySidebar: (content) => set((state) => ({
        isSecondarySidebarOpen: !state.isSecondarySidebarOpen,
        secondarySidebarContent: content || state.secondarySidebarContent
    })),
})); 