import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateOrderPDF = (order) => {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(22)
  doc.text('VASTRALAYA', 105, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('Premium Women\'s Fashion', 105, 26, { align: 'center' })

  // Horizontal Line
  doc.setDrawColor(0)
  doc.line(20, 35, 190, 35)

  // Order Info
  doc.setTextColor(0)
  doc.setFontSize(12)
  doc.text(`Invoice: ${order.order_number}`, 20, 45)
  doc.text(`Date: ${new Date(order.created_at || Date.now()).toLocaleDateString()}`, 20, 52)
  
  // Customer Info
  doc.text('Customer Details:', 130, 45)
  doc.setFontSize(10)
  doc.text(`Name: ${order.customer_name}`, 130, 52)
  doc.text(`Phone: ${order.customer_phone}`, 130, 57)
  if (order.customer_email) doc.text(`Email: ${order.customer_email}`, 130, 62)

  // Items Table
  const tableColumn = ["Product", "Color", "Size", "Qty", "Price", "Subtotal"]
  const tableRows = order.items.map(item => [
    item.product_name,
    item.color || '-',
    item.size || '-',
    item.quantity,
    `INR ${item.product_price.toFixed(2)}`,
    `INR ${item.subtotal.toFixed(2)}`
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0] }
  })

  const finalY = doc.lastAutoTable.finalY || 150

  // Total
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Amount: INR ${order.total_amount.toFixed(2)}`, 190, finalY + 15, { align: 'right' })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Payment Method: ${order.payment_method.toUpperCase()}`, 20, finalY + 15)

  // Footer
  doc.setFontSize(10)
  doc.setTextColor(150)
  doc.text('Thank you for shopping with Vastralaya!', 105, finalY + 40, { align: 'center' })

  doc.save(`Vastralaya_Invoice_${order.order_number}.pdf`)
}
