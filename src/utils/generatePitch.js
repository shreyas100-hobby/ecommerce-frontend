import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateSalesPitchPDF = () => {
  const doc = new jsPDF()
  const gold = [197, 165, 114]
  const black = [0, 0, 0]
  const gray = [100, 100, 100]

  // Helper for Section Headers
  const sectionHeader = (title, y) => {
    doc.setFillColor(248, 248, 248)
    doc.rect(0, y - 10, 210, 20, 'F')
    doc.setTextColor(...black)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 20, y + 4)
  }

  // --- SLIDE 1: COVER ---
  doc.setFillColor(...black)
  doc.rect(0, 0, 210, 297, 'F')
  doc.setTextColor(...gold)
  doc.setFontSize(45)
  doc.text('VASTRALAYA', 105, 100, { align: 'center' })
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text('Maximize Efficiency. Minimize Costs.', 105, 115, { align: 'center' })
  doc.setDrawColor(...gold)
  doc.line(70, 125, 140, 125)
  doc.setFontSize(10)
  doc.text('The Business Growth Proposal 2024', 105, 280, { align: 'center' })

  // --- SLIDE 2: THE ROI & COST SAVING (₹60,000 / Year) ---
  doc.addPage()
  sectionHeader('Stop Wasting Revenue on Manual Tasks', 30)
  
  doc.setTextColor(...black)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('For most stores, managing WhatsApp groups requires a dedicated assistant', 20, 50)
  doc.text('or takes up 4 hours of the owner\'s time daily. That is a massive hidden cost.', 20, 56)

  const costData = [
    ["Expense Type", "Manual / Hired Help", "Vastralaya System", "Yearly Saving"],
    ["Data Entry & Billing", "₹3,500 / Month", "Included", "₹42,000"],
    ["Inventory Audits", "₹1,000 / Month", "Automated", "₹12,000"],
    ["Order Error Losses", "₹500 / Month", "Zero Errors", "₹6,000"],
    ["Total Yearly Cost", "₹60,000", "₹0 Additional", "₹60,000"]
  ]

  autoTable(doc, {
    head: [costData[0]],
    body: costData.slice(1, 4),
    foot: [costData[4]],
    startY: 70,
    theme: 'grid',
    headStyles: { fillColor: black },
    footStyles: { fillColor: gold, textColor: black, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 6 }
  })

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Financial ROI: ₹60,000 Saved Per Year', 20, 150)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  doc.text('This is just the direct saving. When you add the 1,200+ hours saved,', 20, 158)
  doc.text('your ability to focus on sourcing and selling increases your sales by 3x.', 20, 164)

  // --- SLIDE 3: ANALYTICS & GROWTH ---
  doc.addPage()
  sectionHeader('Analytics That Drive Sales', 30)
  
  doc.setTextColor(...black)
  doc.setFontSize(11)
  doc.text('Move from guesswork to data. Understand your business like never before:', 20, 55)

  const analyticsPoints = [
    { t: "Best Sellers Dashboard", d: "Identify your top 5 products every week to restock efficiently." },
    { t: "Peak Shopping Times", d: "Know exactly when your customers are active to drop new arrivals." },
    { t: "Customer Wallet Share", d: "Track which customers are your biggest spenders and keep them loyal." },
    { t: "Zero Dead Stock", d: "Identify slow-moving items and clear them with targeted sales." }
  ]

  analyticsPoints.forEach((p, i) => {
    doc.setFillColor(...gold)
    doc.circle(25, 75 + (i * 25), 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.text(p.t, 32, 76 + (i * 25))
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text(p.d, 32, 82 + (i * 25))
    doc.setTextColor(...black)
  })

  // --- SLIDE 4: THE LUXURY EXPERIENCE ---
  doc.addPage()
  sectionHeader('Professional Digital Storefront', 30)
  
  doc.setFontSize(11)
  doc.text('Give your customers the luxury treatment they deserve.', 20, 55)

  const visualFeatures = [
    ["Feature", "Customer Experience Impact"],
    ["Digital Catalog", "Professional browsing experience without messy group images."],
    ["Auto PDF Invoices", "Branded bills sent instantly—builds 10x more trust."],
    ["Live Tracking", "Customers see status updates without calling or messaging you."],
    ["One-Tap Map", "Accurate delivery locations shared directly at checkout."]
  ]

  autoTable(doc, {
    head: [visualFeatures[0]],
    body: visualFeatures.slice(1),
    startY: 65,
    theme: 'striped',
    headStyles: { fillColor: black },
    styles: { fontSize: 10 }
  })

  // --- SLIDE 5: CONCLUSION ---
  doc.addPage()
  doc.setFillColor(...black)
  doc.rect(0, 0, 210, 297, 'F')
  doc.setTextColor(...gold)
  doc.setFontSize(30)
  doc.text('Start Saving. Start Scaling.', 105, 120, { align: 'center' })
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.text('The most efficient way to run a WhatsApp-based business.', 105, 135, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setTextColor(...gold)
  doc.text('VASTRALAYA', 105, 260, { align: 'center' })
  
  doc.save('Vastralaya_Cost_Saving_Proposal.pdf')
}
