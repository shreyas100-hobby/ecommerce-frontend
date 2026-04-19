import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminPreview() {
  const navigate = useNavigate()

  const stats = [
    { label: 'Total Orders', value: '1,284', icon: '📦' },
    { label: 'Total Revenue', value: '₹8,42,000', icon: '💰' },
    { label: 'Growth', value: '+24%', icon: '📈' },
    { label: 'Conversion', value: '18.5%', icon: '✨' }
  ]

  const sampleOrders = [
    { id: '#8592', name: 'Anjali Sharma', status: 'Delivered', amount: '₹2,499' },
    { id: '#8591', name: 'Priya Patel', status: 'Shipped', amount: '₹1,850' },
    { id: '#8590', name: 'Neha Gupta', status: 'Confirmed', amount: '₹3,200' },
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      
      {/* Sticky Demo Bar */}
      <div className="sticky top-0 z-[100] bg-black text-white px-6 py-3 flex justify-between items-center border-b border-gold/20">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
            Vastralaya Admin Demo
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-white text-black px-4 py-1.5 text-[9px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
        >
          ← Exit Demo & Back to Site
        </button>
      </div>

      <div className="p-8 md:p-12 max-w-6xl mx-auto">
        
        {/* Warning Banner removed - integrated into Sticky Bar */}

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl text-black">Control Center</h1>
          <p className="text-black/40 text-sm">Real-time store management interface</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-8 border border-black/5 shadow-sm">
              <div className="text-2xl mb-4">{s.icon}</div>
              <p className="text-[10px] uppercase tracking-widest text-black/40 mb-2">{s.label}</p>
              <p className="text-3xl font-display text-black">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Areas */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white border border-black/5 shadow-sm">
            <div className="p-6 border-b border-black/5 font-display text-lg">Recent Transactions</div>
            <div className="divide-y divide-black/5">
              {sampleOrders.map((o, i) => (
                <div key={i} className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-black">{o.name}</p>
                    <p className="text-[10px] text-black/30 uppercase tracking-widest">{o.id}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-display text-gold">{o.amount}</span>
                    <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-black text-white">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Insights */}
          <div className="bg-black text-white p-8">
            <h3 className="font-display text-xl mb-6">Marketing ROI</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2 text-white/40">
                  <span>Direct Sales</span>
                  <span>72%</span>
                </div>
                <div className="h-1 bg-white/10 w-full"><div className="h-full bg-gold w-[72%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2 text-white/40">
                  <span>WhatsApp Groups</span>
                  <span>28%</span>
                </div>
                <div className="h-1 bg-white/10 w-full"><div className="h-full bg-gold/50 w-[28%]"></div></div>
              </div>
            </div>
            
            <div className="mt-12 p-6 border border-white/10 bg-white/5">
              <p className="text-xs italic text-white/60 leading-relaxed">
                "Since switching to Vastralaya, your store has saved 18 hours of manual billing this week."
              </p>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-black/40 text-sm mb-6">Ready to control your store like this?</p>
          <a 
            href="https://wa.me/917588110778?text=Hi%20Shreyas!%20I%20saw%20the%20Admin%20Demo%20and%20I%20want%20this%20dashboard%20for%20my%20store."
            className="bg-gold text-black px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-colors inline-block"
          >
            Launch My Store Now
          </a>
        </div>

      </div>
    </div>
  )
}
