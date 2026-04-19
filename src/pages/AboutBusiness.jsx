import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AboutBusiness() {
  const navigate = useNavigate()

  const features = [
    {
      title: "Premium Digital Catalog",
      desc: "Give your customers a luxury browsing experience. High-resolution imagery, organized categories, and seamless mobile-first design.",
      icon: "👗"
    },
    {
      title: "One-Click WhatsApp Orders",
      desc: "No more messy chats. Orders come directly to your WhatsApp with full details, quantities, and customer info—ready for confirmation.",
      icon: "💬"
    },
    {
      title: "Automated PDF Invoicing",
      desc: "Instantly generate professional, branded PDF bills for every order. Build trust and professionalism with every sale.",
      icon: "📄"
    },
    {
      title: "Live Order Tracking",
      desc: "Reduce 'Where is my order?' messages by 90%. Customers can track their status and download bills through their own portal.",
      icon: "📍"
    }
  ]

  const roiPoints = [
    {
      label: "Yearly Savings",
      value: "₹60,000+",
      detail: "Eliminate manual data entry and billing costs."
    },
    {
      label: "Time Saved",
      value: "1,200+ Hrs",
      detail: "Reclaim 4 hours daily from manual WhatsApp group management."
    },
    {
      label: "Accuracy",
      value: "99.9%",
      detail: "Zero errors in order taking, addressing, or billing."
    }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹999",
      period: "/month",
      desc: "Perfect for home-run boutiques starting their digital journey.",
      features: ["Up to 50 Products", "WhatsApp Order Sync", "Basic Analytics", "Digital Catalog"],
      waMessage: "Hi Shreyas! I want to start with the Starter Plan for my boutique."
    },
    {
      name: "Growth",
      price: "₹2,499",
      period: "/month",
      desc: "For established stores ready to scale and automate everything.",
      features: ["Unlimited Products", "Auto PDF Invoicing", "Advanced Analytics", "Order Tracking Portal", "Priority Support"],
      featured: true,
      waMessage: "Hi Shreyas! I'm interested in the Growth Plan for my store. Can we get started?"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Tailored solutions for large retail chains with multiple locations.",
      features: ["Multi-store Management", "Custom Domain", "Dedicated Account Manager", "Custom Integrations"],
      waMessage: "Hi Shreyas! I'm looking for an Enterprise solution for my retail chain. Let's talk."
    }
  ]

  const contactWA = (msg) => {
    const encoded = encodeURIComponent(msg || "Hi Shreyas! I saw the Vastralaya platform and I'm interested in getting it for my store.")
    window.open(`https://wa.me/917588110778?text=${encoded}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="bg-black text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-6">Modernizing Local Retail</p>
          <h1 className="font-display text-5xl md:text-7xl mb-8 leading-tight">
            The Premium Way to Sell on WhatsApp.
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Vastralaya transforms chaotic WhatsApp group selling into a streamlined, 
            high-end digital storefront that saves you money and grows your brand.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/shop')}
              className="bg-gold text-black px-10 py-4 text-[10px] tracking-widest uppercase font-medium hover:bg-white transition-colors"
            >
              View Live Demo
            </button>
            <button 
              onClick={() => contactWA()}
              className="border border-white/20 text-white px-10 py-4 text-[10px] tracking-widest uppercase font-medium hover:bg-white hover:text-black transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-black mb-4">Powerful Features</h2>
            <div className="w-12 h-1 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white border border-black/5 p-8 hover:border-gold/30 transition-colors group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="font-display text-xl text-black mb-4">{f.title}</h3>
                <p className="text-black/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Demo Section */}
      <section className="py-24 px-6 bg-white border-y border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-4">Total Control</p>
            <h2 className="font-display text-4xl text-black mb-6">Powerful Control Center</h2>
            <p className="text-black/50 text-sm leading-relaxed mb-8">
              Manage your entire business from a single, beautiful dashboard. 
              Track revenue, monitor top-selling products, manage inventory, and 
              process orders with zero friction.
            </p>
            <ul className="space-y-4 mb-10">
              {["Real-time Revenue Analytics", "One-tap Inventory Updates", "Automated Order Status Management", "Customer Insight Reports"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate('/admin/preview')}
              className="bg-black text-white px-8 py-4 text-[10px] tracking-widest uppercase font-medium hover:bg-gold hover:text-black transition-colors"
            >
              Preview Admin Dashboard →
            </button>
          </div>
          <div className="lg:w-1/2 relative">
             {/* Mock Dashboard UI */}
             <div className="bg-cream p-8 shadow-2xl border border-black/5 scale-105 transform origin-left">
                <div className="flex gap-4 mb-8">
                  <div className="h-20 flex-1 bg-white p-4 border border-black/5">
                    <div className="h-2 w-1/2 bg-black/5 mb-2"></div>
                    <div className="h-4 w-3/4 bg-gold/20"></div>
                  </div>
                  <div className="h-20 flex-1 bg-white p-4 border border-black/5">
                    <div className="h-2 w-1/2 bg-black/5 mb-2"></div>
                    <div className="h-4 w-3/4 bg-gold/20"></div>
                  </div>
                </div>
                <div className="h-40 bg-white p-4 border border-black/5">
                  <div className="h-2 w-1/4 bg-black/5 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-black/5"></div>
                    <div className="h-2 w-full bg-black/5"></div>
                    <div className="h-2 w-3/4 bg-black/5"></div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="bg-white py-24 px-6 border-y border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {roiPoints.map((point, i) => (
              <div key={i}>
                <p className="text-[10px] text-black/40 uppercase tracking-widest mb-4">{point.label}</p>
                <p className="font-display text-6xl text-gold mb-4">{point.value}</p>
                <p className="text-black/60 text-sm max-w-[200px] mx-auto">{point.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-cream" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-black mb-4">Transparent Pricing</h2>
            <p className="text-black/40 text-sm">Choose the plan that fits your store's scale.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <div 
                key={i} 
                className={`
                  p-10 border ${plan.featured ? 'border-gold bg-black text-white' : 'border-black/5 bg-white text-black'}
                  relative overflow-hidden
                `}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-0 bg-gold text-black text-[8px] font-bold uppercase tracking-widest px-4 py-1">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-2xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-display">{plan.price}</span>
                  <span className={`${plan.featured ? 'text-white/40' : 'text-black/40'} text-sm`}>{plan.period}</span>
                </div>
                <p className={`${plan.featured ? 'text-white/60' : 'text-black/50'} text-sm mb-8 leading-relaxed`}>
                  {plan.desc}
                </p>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-xs tracking-wide">
                      <span className="text-gold">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => contactWA(plan.waMessage)}
                  className={`
                    w-full py-4 text-[10px] tracking-widest uppercase font-medium transition-colors
                    ${plan.featured ? 'bg-gold text-black hover:bg-white' : 'bg-black text-white hover:bg-gold hover:text-black'}
                  `}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-black text-white p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h2 className="font-display text-3xl md:text-5xl mb-8 relative z-10">Stop Managing, Start Growing.</h2>
          <p className="text-white/50 mb-10 relative z-10 leading-relaxed">
            Every minute you spend scrolling through WhatsApp chats to find an address is a minute 
            not spent growing your business. Vastralaya automates the boring stuff so you can 
            focus on what you love: Fashion.
          </p>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-gold text-black px-10 py-4 text-[10px] tracking-widest uppercase font-medium hover:bg-white transition-colors relative z-10"
          >
            See Demo Now
          </button>
        </div>
      </section>

      {/* Developer Contact Footer */}
      <footer className="bg-offwhite border-t border-black/5 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="font-display text-2xl text-black mb-2">Interested in Scaling?</h4>
            <p className="text-black/40 text-sm">Get in touch with our development team for custom solutions.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 text-center md:text-right">
            <div>
              <p className="text-[10px] text-black/30 uppercase tracking-widest mb-1">Developer Contact</p>
              <p className="text-black font-medium">Shreyas</p>
            </div>
            <div>
              <p className="text-[10px] text-black/30 uppercase tracking-widest mb-1">Email ID</p>
              <a href="mailto:shreyas100100@outlook.com" className="text-gold hover:text-black transition-colors">
                shreyas100100@outlook.com
              </a>
            </div>
            <div>
              <p className="text-[10px] text-black/30 uppercase tracking-widest mb-1">Phone Number</p>
              <a href="tel:7588110778" className="text-black font-medium hover:text-gold transition-colors">
                +91 7588110778
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-black/5 text-center">
          <p className="text-[10px] text-black/20 uppercase tracking-[0.5em]">© 2024 Vastralaya Platform</p>
        </div>
      </footer>
    </div>
  )
}
