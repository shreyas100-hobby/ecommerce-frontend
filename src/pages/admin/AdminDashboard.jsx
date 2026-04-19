import { useEffect, useState } from 'react'
import { adminGetOrders, adminGetProducts, getCategories } from '../../api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    categories: 0,
    revenue: 0,
    pending: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        adminGetOrders(),
        adminGetProducts(),
        getCategories(),
      ])

      const orders = ordersRes.data.data || []
      const products = productsRes.data.data || []
      const categories = categoriesRes.data.data || []

      const revenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0)

      const pending = orders.filter(o => o.status === 'pending').length

      setStats({
        orders: orders.length,
        products: products.length,
        categories: categories.length,
        revenue,
        pending,
      })

      setRecentOrders(orders.slice(0, 5))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Orders', value: stats.orders, prefix: '' },
    { label: 'Revenue', value: `₹${stats.revenue.toFixed(0)}`, prefix: '' },
    { label: 'Products', value: stats.products, prefix: '' },
    { label: 'Pending Orders', value: stats.pending, prefix: '' },
  ]

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-black/10 p-6 h-24" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Page Title */}
      <div>
        <h2 className="font-display text-3xl text-black">Dashboard</h2>
        <p className="text-black/40 text-sm mt-1">Welcome back</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white border border-black/10 p-6">
            <p className="text-[10px] text-black/40 tracking-widest uppercase mb-3">
              {card.label}
            </p>
            <p className="font-display text-3xl text-black">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-black/10">
        <div className="px-6 py-4 border-b border-black/10 flex justify-between items-center">
          <h3 className="font-display text-lg text-black">Recent Orders</h3>
          <a
            href="/admin/orders"
            className="text-[10px] text-black/40 hover:text-black tracking-widest uppercase transition-colors"
          >
            View All →
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black/30 text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {recentOrders.map(order => (
              <div
                key={order.id}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-black truncate">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-black/40 mt-0.5">
                    {order.order_number}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p className="text-sm font-semibold text-gold">
                    ₹{order.total_amount.toFixed(0)}
                  </p>
                  <span className={`
                    text-[10px] px-2.5 py-1 font-medium tracking-widest uppercase
                    ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}
                  `}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}