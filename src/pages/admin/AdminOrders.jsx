import { useEffect, useState } from 'react'
import { adminGetOrders, adminGetOrder, adminUpdateOrderStatus } from '../../api'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { data } = await adminGetOrders()
      setOrders(data.data || [])
    } catch {
      console.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = async (id) => {
    try {
      const { data } = await adminGetOrder(id)
      setSelectedOrder(data.data)
    } catch {
      alert('Failed to load order details')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id)
    try {
      await adminUpdateOrderStatus(id, status)
      await loadOrders()
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => ({ ...prev, status }))
      }
    } catch {
      alert('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = filterStatus
    ? orders.filter(o => o.status === filterStatus)
    : orders

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-3xl text-black">Orders</h2>
          <p className="text-black/40 text-sm mt-1">{orders.length} total</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 text-[10px] tracking-widest uppercase font-medium border transition-colors
              ${filterStatus === s
                ? 'bg-black border-black text-white'
                : 'border-black/20 text-black/50 hover:border-black hover:text-black bg-white'
              }`}
          >
            {s === '' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-black/10">
        {loading ? (
          <div className="p-12 text-center text-black/30 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-xl text-black mb-2">No orders found</p>
            <p className="text-black/30 text-sm">Orders will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10 bg-cream">
                  {['Order', 'Customer', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-[10px] tracking-widest uppercase text-black/40 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-cream transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-black">
                        {order.order_number}
                      </p>
                      <p className="text-[10px] text-black/30 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-black">{order.customer_name}</p>
                      <p className="text-[10px] text-black/30">{order.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gold">
                        ₹{order.total_amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-black/50 font-medium">
                        {order.payment_method}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusUpdate(order.id, e.target.value)}
                        className={`text-[10px] px-2.5 py-1 font-medium tracking-widest uppercase border-0 outline-none cursor-pointer
                          ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}
                          disabled:opacity-50`}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="text-[10px] tracking-widest uppercase text-black/40 hover:text-black transition-colors font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[200]"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[300] w-full max-w-md max-h-[90vh] overflow-y-auto">

            <div className="px-6 py-5 border-b border-black/10 flex justify-between items-center">
              <div>
                <h3 className="font-display text-xl text-black">
                  {selectedOrder.order_number}
                </h3>
                <p className="text-[10px] text-black/30 tracking-widest uppercase mt-0.5">
                  Order Details
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-black/30 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Customer */}
              <div>
                <p className="text-[10px] text-black/30 tracking-widest uppercase mb-3">
                  Customer
                </p>
                <div className="space-y-1.5">
                  <p className="text-sm text-black font-medium">
                    {selectedOrder.customer_name}
                  </p>
                  <p className="text-sm text-black/60">
                    {selectedOrder.customer_phone}
                  </p>
                  {selectedOrder.customer_address && (
                    <p className="text-sm text-black/60">
                      {selectedOrder.customer_address}
                    </p>
                  )}
                  {selectedOrder.note && (
                    <p className="text-xs text-gold italic mt-2">
                      Note: {selectedOrder.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] text-black/30 tracking-widest uppercase mb-3">
                  Items
                </p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-black/5 pb-2">
                      <span className="text-black/70">
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="font-medium text-black">
                        ₹{item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold text-sm pt-1">
                    <span className="text-black">Total</span>
                    <span className="text-gold">
                      ₹{selectedOrder.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <p className="text-[10px] text-black/30 tracking-widest uppercase mb-3">
                  Update Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                      className={`px-3 py-1.5 text-[10px] tracking-widest uppercase font-medium border transition-colors
                        ${selectedOrder.status === s
                          ? 'bg-black border-black text-white'
                          : 'border-black/20 text-black/50 hover:border-black hover:text-black'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  )
}