// src/store/cartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        const items = get().items
        const cartKey = variant ? `${product.id}_${variant.id}` : product.id
        const existing = items.find(i => i.cartKey === cartKey)
        const stock = variant ? variant.stock_quantity : product.stock_quantity

        if (existing) {
          const newQty = existing.quantity + quantity
          if (newQty > stock) return false // Deny if exceeds stock

          set({
            items: items.map(i =>
              i.cartKey === cartKey
                ? { ...i, quantity: newQty }
                : i
            )
          })
          return true
        } else {
          if (quantity > stock) return false

          const imageURL = product.images?.[0]?.url || product.image_url || ''
          set({
            items: [
              ...items,
              {
                cartKey,
                id: product.id,
                variantId: variant?.id || null,
                name: product.name,
                price: product.price,
                image_url: imageURL,
                color: variant?.color || '',
                size: variant?.size || '',
                quantity,
                stock, // Store stock limit
              }
            ]
          })
          return true
        }
      },

      removeItem: (cartKey) =>
        set({ items: get().items.filter(i => i.cartKey !== cartKey) }),

      updateQuantity: (cartKey, quantity) => {
        const items = get().items
        const item = items.find(i => i.cartKey === cartKey)
        if (!item) return

        if (quantity <= 0) {
          get().removeItem(cartKey)
          return
        }

        // Validate against stored stock
        if (quantity > item.stock) return

        set({
          items: items.map(i =>
            i.cartKey === cartKey ? { ...i, quantity } : i
          )
        })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: 'cart-storage' }
  )
)

export default useCartStore