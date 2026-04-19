import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAdminStore from '../../store/adminStore'

export default function AdminLogin() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!key.trim()) {
      setError('Please enter the admin key')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Test the key against a real admin endpoint
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/admin/orders`,
        { headers: { 'X-Admin-Key': key } }
      )

      if (res.status === 401) {
        setError('Invalid admin key. Please try again.')
        setLoading(false)
        return
      }

      login(key)
      navigate('/admin')

    } catch {
      setError('Could not connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white border border-black/10 p-10 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-0.5 bg-gold mx-auto mb-6" />
          <h1 className="font-display text-3xl text-black mb-1">
            Vastralaya
          </h1>
          <p className="text-[10px] text-black/30 tracking-[0.3em] uppercase">
            Admin Panel
          </p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-6" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-black/40 mb-2 tracking-widest uppercase">
              Admin Key
            </label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Enter your admin key"
              className="w-full border border-black/20 px-4 py-3 text-sm text-black outline-none focus:border-black placeholder:text-black/20 bg-white"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase font-medium transition-colors disabled:bg-black/30"
          >
            {loading ? 'Verifying...' : 'Enter Dashboard'}
          </button>
        </form>

        <p className="text-center mt-6">
          <a
            href="/"
            className="text-[10px] text-black/30 hover:text-black tracking-widest uppercase transition-colors"
          >
            ← Back to Shop
          </a>
        </p>

      </div>
    </div>
  )
}