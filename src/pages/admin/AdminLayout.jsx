import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAdminStore from '../../store/adminStore'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '▪', end: true },
  { to: '/admin/products', label: 'Products', icon: '▪' },
  { to: '/admin/orders', label: 'Orders', icon: '▪' },
  { to: '/admin/categories', label: 'Categories', icon: '▪' },
]

export default function AdminLayout() {
  const { logout } = useAdminStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-cream flex">

      {/* Sidebar */}
      <aside className="w-56 bg-black text-white flex flex-col fixed h-full z-10">

        {/* Logo */}
        <div className="px-6 py-8 border-b border-white/10">
          <h1 className="font-display text-xl text-white">Vastralaya</h1>
          <p className="text-[10px] text-gold tracking-[0.2em] uppercase mt-0.5">
            Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-xs tracking-widest uppercase font-medium transition-colors
                ${isActive
                  ? 'bg-gold text-black'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-[8px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2.5 text-xs tracking-widest uppercase font-medium text-white/30 hover:text-white hover:bg-white/5 transition-colors text-left flex items-center gap-3"
          >
            <span className="text-[8px]">▪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 min-h-screen">

        {/* Top Bar */}
        <div className="bg-white border-b border-black/10 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <p className="text-xs text-black/30 tracking-widest uppercase">
            Admin Dashboard
          </p>
          <button
            onClick={handleLogout}
            className="text-[10px] text-black/30 hover:text-black tracking-widest uppercase transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>

      </main>

    </div>
  )
}