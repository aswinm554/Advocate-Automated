import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = (payment, clientName, advocateName) => {
  const invoicesDir = "uploads/invoices";

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const filePath = path.join(
    invoicesDir,
    `invoice-${payment._id}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Legal Service Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Invoice ID: ${payment._id}`);
  doc.text(`Client: ${clientName}`);
  doc.text(`Advocate: ${advocateName}`);
  doc.text(`Amount: ₹${payment.amount}`);
  doc.text(`Payment Type: ${payment.paymentType}`);
  doc.text(`Status: ${payment.status}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.end();

  return filePath;
};
