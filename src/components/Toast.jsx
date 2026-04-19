import { useState, useEffect } from 'react'

let toastFn = null

export function showToast(message, type = 'default') {
  if (toastFn) toastFn(message, type)
}

export default function Toast() {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    toastFn = (message, type) => {
      setToast({ message, type })
      setTimeout(() => setToast(null), 3000)
    }
    return () => { toastFn = null }
  }, [])

  if (!toast) return null

  const styles = {
    success: 'bg-black text-gold border border-gold/30',
    error: 'bg-black text-red-400 border border-red-400/30',
    default: 'bg-black text-white border border-white/10',
  }

  return (
    <div className={`
      fixed bottom-6 left-1/2 -translate-x-1/2
      px-6 py-3 rounded-full shadow-2xl
      text-sm font-medium z-[999]
      ${styles[toast.type] || styles.default}
    `}>
      {toast.message}
    </div>
  )
}