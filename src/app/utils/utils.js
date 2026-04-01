import jsPDF from "jspdf";

//PDF Previewe
  export const handlePreview = (selectedParty) => {
    console.log(selectedParty, "selected party")
  if (!selectedParty) {
    alert("No party selected ❌");
    return;
  }

  if (!selectedParty.amount) {
    alert("Enter amount ❌");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("INVOICE", 105, 10, { align: "center" });

  const now = new Date();
  doc.setFontSize(10);
  doc.text(
    `Date: ${now.toLocaleDateString()}\nTime: ${now.toLocaleTimeString()}`,
    200,
    10,
    { align: "right" }
  );

  doc.text(`Customer: ${selectedParty.name}`, 10, 20);

  let y = 40;
  doc.setFontSize(12);
  doc.text("Details", 10, y);
  doc.text("Amount", 160, y);

  y += 5;
  doc.line(10, y, 200, y);

  y += 10;
  doc.text(selectedParty.details || "N/A", 10, y);
  doc.text(`Rs. ${selectedParty.amount}`, 160, y);

  // ✅ BEST preview method
  doc.output("dataurlnewwindow");
};