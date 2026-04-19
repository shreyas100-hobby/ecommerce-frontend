import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAdminStore = create(
  persist(
    (set) => ({
      apiKey: null,
      isAuthenticated: false,

      login: (key) => {
        localStorage.setItem('admin_key', key)
        set({ apiKey: key, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('admin_key')
        set({ apiKey: null, isAuthenticated: false })
      },
    }),
    { name: 'admin-storage' }
  )
)

export default useAdminStore