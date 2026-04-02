import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import IconButton from '@mui/material/IconButton';

export default function PDFHandler({ party, act }) {
  console.log(party,"party from pdf handler")
  const handlePDF = async (action = act) => {
    
let data = party?.data;
console.log(party?.data,"part data")

if (!data || data.length === 0) {
  const res = await fetch(`/api/ledger?party_id=${party.id}`);
  data = await res.json();
}
    // const res = await fetch(`/api/ledger?party_id=${party.id}`);
    // const data = await res.json();
  console.log(party,"party from pdf handler")

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Transactions Report - ${party.name}`, 14, 15);

    let balance = 0;

    console.log(data,"lo g data")
    // 🔥 detect structure
   const hasPName = data[0]?.pName && data[0]?.pName !== "-";
console.log(hasPName,"has name ")
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
      {/* <Button size="small" onClick={() => handlePDF("preview")}>
        Preview
      </Button> */}
      <IconButton onClick={() => handlePDF("preview")} color="warning">
      <RemoveRedEyeIcon />
      </IconButton>
      <IconButton onClick={() => handlePDF("download")} color="secondary">
      <CloudDownloadIcon />
      </IconButton>

      {/* <Button size="small" onClick={() => handlePDF("download")}>
        Download
      </Button> */}
    </>
  );
}