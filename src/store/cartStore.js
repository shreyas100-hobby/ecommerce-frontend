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

        // Cart key = productId + variantId (unique per variant)
        const cartKey = variant
          ? `${product.id}_${variant.id}`
          : product.id

        const existing = items.find(i => i.cartKey === cartKey)

        if (existing) {
          set({
            items: items.map(i =>
              i.cartKey === cartKey
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          })
        } else {
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
              }
            ]
          })
        }
      },

      removeItem: (cartKey) =>
        set({ items: get().items.filter(i => i.cartKey !== cartKey) }),

      updateQuantity: (cartKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartKey)
          return
        }
        set({
          items: get().items.map(i =>
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