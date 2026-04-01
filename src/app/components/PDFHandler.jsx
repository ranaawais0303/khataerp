import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";

export default function PDFHandler({ party, act }) {
  const handlePDF = async (action = act) => {
    const res = await fetch(`/api/ledger?party_id=${party.id}`);
    const data = await res.json();

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Ledger Report - ${party.name}`, 14, 15);

    let balance = 0;

    // 🔥 detect structure
    const hasPName = !!data[0]?.pName;

    const columns = hasPName
      ? ["Name", "Date", "Type", "Amount", "Mode", "Details", "Balance"]
      : ["Date", "Type", "Amount", "Mode", "Balance"];

    const rows = data.map((t) => {
      if (t.type === "receive") balance += Number(t.amount);
      else balance -= Number(t.amount);

      return hasPName
        ? [
            t.pName,
            t.date,
            t.type.toUpperCase(),
            `Rs. ${t.amount}`,
            t.mode,
            t.details || "-",
            `Rs. ${balance}`,
          ]
        : [
            t.date,
            t.type.toUpperCase(),
            `Rs. ${t.amount}`,
            t.mode,
            `Rs. ${balance}`,
          ];
    });

    autoTable(doc, {
      startY: 25,
      head: [columns],
      body: rows,
    });

    // 🔥 action control
    if (action === "preview") {
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } else {
      doc.save(`${party.name}-ledger.pdf`);
    }
  };

  return (
    <>
      <Button size="small" onClick={() => handlePDF("preview")}>
        Preview
      </Button>

      <Button size="small" onClick={() => handlePDF("download")}>
        Download
      </Button>
    </>
  );
}