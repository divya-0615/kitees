import jsPDF from "jspdf"

export const generateReceiptPDF = (orderData) => {
    const doc = new jsPDF()

    // Set colors
    const primaryColor = [16, 185, 129] // Green
    const secondaryColor = [59, 130, 246] // Blue
    const textColor = [30, 41, 59] // Dark gray
    const lightGray = [156, 163, 175]

    // Header
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 40, "F")

    // Company Logo/Name
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("KITEES", 20, 25)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Electronics Kits & Components", 20, 32)

    // Receipt Title
    doc.setTextColor(...textColor)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("ORDER RECEIPT", 140, 25)

    // Order Info Box
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.5)
    doc.rect(140, 30, 60, 25)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Order ID: ${orderData.orderId}`, 145, 38)
    doc.text(`Date: ${orderData.orderDate}`, 145, 44)
    doc.text(`Time: ${orderData.orderTime}`, 145, 50)

    // Customer Details Section
    let yPos = 70
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...secondaryColor)
    doc.text("CUSTOMER DETAILS", 20, yPos)

    yPos += 10
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...textColor)
    doc.text(`Name: ${orderData.customerDetails.name}`, 20, yPos)
    yPos += 6
    doc.text(`Email: ${orderData.customerDetails.email}`, 20, yPos)
    yPos += 6
    if (orderData.customerDetails.mobile) {
        doc.text(`Mobile: ${orderData.customerDetails.mobile}`, 20, yPos)
        yPos += 6
    }
    if (orderData.customerDetails.college) {
        doc.text(`College: ${orderData.customerDetails.college}`, 20, yPos)
        yPos += 6
    }

    // Shipping Address Section
    yPos += 10
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...secondaryColor)
    doc.text("SHIPPING ADDRESS", 20, yPos)

    yPos += 10
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...textColor)
    doc.text(`${orderData.shippingAddress.address}`, 20, yPos)
    yPos += 6
    doc.text(`${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}`, 20, yPos)
    yPos += 6
    doc.text(`PIN: ${orderData.shippingAddress.pincode}`, 20, yPos)

    // Order Items Section
    yPos += 20
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...secondaryColor)
    doc.text("ORDER ITEMS", 20, yPos)

    // Table Header
    yPos += 15
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos - 8, 170, 12, "F")

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...textColor)
    doc.text("Item Name", 25, yPos)
    doc.text("Qty", 120, yPos)
    doc.text("Price", 140, yPos)
    doc.text("Total", 165, yPos)

    // Table Items
    yPos += 10
    let subtotal = 0

    orderData.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity
        subtotal += itemTotal

        // Alternate row background
        if (index % 2 === 0) {
            doc.setFillColor(252, 252, 252)
            doc.rect(20, yPos - 6, 170, 10, "F")
        }

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(...textColor)

        // Item name (truncate if too long)
        let itemName = item.name
        if (itemName.length > 35) {
            itemName = itemName.substring(0, 32) + "..."
        }
        doc.text(itemName, 25, yPos)

        // Quantity
        doc.text(item.quantity.toString(), 125, yPos)

        // Price
        doc.text(`₹${item.price.toFixed(2)}`, 140, yPos)

        // Total
        doc.text(`₹${itemTotal.toFixed(2)}`, 165, yPos)

        yPos += 8

        // Add components info for custom kits
        if (item.type === "custom-kit" && item.components && item.components.length > 0) {
            doc.setFontSize(8)
            doc.setTextColor(...lightGray)
            doc.text(`Components: ${item.components.length} items included`, 30, yPos)
            yPos += 6
        }

        yPos += 2
    })

    // Total Section
    yPos += 10
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.5)
    doc.line(120, yPos, 190, yPos)

    yPos += 10
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...textColor)
    doc.text("TOTAL AMOUNT:", 120, yPos)
    doc.setTextColor(...primaryColor)
    doc.text(`₹${orderData.totalAmount.toFixed(2)}`, 165, yPos)

    // Payment Method
    yPos += 15
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...textColor)
    doc.text(`Payment Method: ${orderData.paymentMethod.toUpperCase()}`, 20, yPos)

    // Footer
    yPos += 30
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)

    yPos += 10
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...primaryColor)
    doc.text("Thank you for shopping with Kitees!", 20, yPos)

    yPos += 8
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...textColor)
    doc.text("Website: https://kitees.com", 20, yPos)
    yPos += 5
    doc.text("Email: support@kitees.com", 20, yPos)
    yPos += 5
    doc.text("For any queries, please contact our support team.", 20, yPos)

    // Add a subtle border around the entire document
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(1)
    doc.rect(10, 10, 190, 277)

    // Save the PDF
    doc.save(`Kitees_Receipt_${orderData.orderId}.pdf`)
}