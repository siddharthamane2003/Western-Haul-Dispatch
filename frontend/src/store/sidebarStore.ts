import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggleCollapse: () => void
  setCollapsed: (collapsed: boolean) => void
  toggleMobile: () => void
  setMobileOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,

      toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      toggleMobile: () => set((s) => ({ isMobileOpen: !s.isMobileOpen })),
      setMobileOpen: (open) => set({ isMobileOpen: open }),
    }),
    {
      name: 'whd-sidebar',
      partialize: (s) => ({ isCollapsed: s.isCollapsed }),
    }
  )
)
