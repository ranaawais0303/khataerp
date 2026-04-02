"use client";

import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
} from "@mui/material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useRouter } from "next/navigation";
import PDFHandler from "../components/PDFHandler";
import { handlePreview } from "../utils/utils";
import TransactionDialog from "../components/TransactionDialog";


export default function Transactions() {
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const initialValues = {
    name:"",
    amount: "",
    mode: "cash",
    date: "",
    details: "",
    type: "receive",
  }
  const [formData, setForm] = useState({
    name:"",
    amount: "",
    mode: "cash",
    date: "",
    details: "",
    type: "receive",
  });

  //use router
  const router = useRouter();

  // 🔄 Load Parties
  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setParties);
  }, []);

  // 🔍 Filter
  const filtered = parties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ➕ Open Modal
  const handleOpen = (party, type) => {
    console.log(party.name,"here is the party bro")
    setSelectedParty(party);
      setForm({
    ...formData,
    name: party.name,
    type: type,
  });
    setOpen(true);
  };

  // 💾 Save Transaction
//   const handleSave = async () => {
//   if (!selectedParty) {
//     alert("No party selected ❌");
//     return;
//   }

//   if (!formData.amount) {
//     alert("Enter amount ❌");
//     return;
//   }


//   await fetch("/api/transactions", {
//     method: "POST",
//     body: JSON.stringify({
//       ...formData,
//       party_id: selectedParty.id,
//     }),
//   });

//   alert("Transaction Saved ✅");
//   // 🧾 Generate PDF after save
 
// // const doc = new jsPDF();

// // // 🧾 Title (center)
// // doc.setFontSize(18);
// // doc.text("INVOICE", 105, 10, { align: "center" });

// // // 📅 Right top (date & time)
// // const now = new Date();
// // doc.setFontSize(10);
// // doc.text(
// //   `Date: ${now.toLocaleDateString()}\nTime: ${now.toLocaleTimeString()}`,
// //   200,
// //   10,
// //   { align: "right" }
// // );

// // // 👤 Left top (customer)
// // doc.text(`Customer: ${selectedParty.name}`, 10, 20);

// // // 📋 Table header
// // let y = 40;
// // doc.setFontSize(12);
// // doc.text("Details", 10, y);
// // doc.text("Amount", 160, y);

// // // ➖ Line
// // y += 5;
// // doc.line(10, y, 200, y);

// // // 📄 Data row
// // y += 10;
// // doc.text(formData.details || "N/A", 10, y);
// // doc.text(`Rs. ${formData.amount}`, 160, y);

// // // 💾 Save
// // doc.save(`${selectedParty.name}-invoice.pdf`);

// //   alert("Transaction Saved & PDF Downloaded ✅");

//   setOpen(false);
// };


const handleSave = async (data) => {
  if (!selectedParty) {
    alert("No party selected ❌");
    return;
  }

  if (!data.amount) {
    alert("Enter amount ❌");
    return;
  }

  await fetch("/api/transactions", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      party_id: selectedParty.id,
    }),
  });

  alert("Transaction Saved ✅");
  setOpen(false);
};


//download pdf
// const handleDownload = async (party) => {
//   const res = await fetch(`/api/ledger?party_id=${party.id}`);
//   const data = await res.json();

//   const doc = new jsPDF();

//   // Title
//   doc.setFontSize(16);
//   doc.text(`Ledger Report - ${party.name}`, 14, 15);

//   // Table Columns
//   const columns = [
//     { header: "Date", dataKey: "date" },
//     { header: "Type", dataKey: "type" },
//     { header: "Amount", dataKey: "amount" },
//     { header: "Mode", dataKey: "mode" },
//     { header: "Details", dataKey: "details" },
//     { header: "Balance", dataKey: "balance" },
//   ];

//   // Prepare Rows + Balance
//   let balance = 0;

//   const rows = data.map((t) => {
//     if (t.type === "receive") balance += Number(t.amount);
//     else balance -= Number(t.amount);

//     return {
//       date: t.date,
//       type: t.type.toUpperCase(),
//       amount: `Rs. ${t.amount}`,
//       mode: t.mode,
//       details: t.details || "-",
//       balance: `Rs. ${balance}`,
//     };
//   });

//   // Generate Table
//   autoTable(doc, {
//     startY: 25,
//     head: [columns.map((col) => col.header)],
//     body: rows.map((row) => Object.values(row)),
//     styles: {
//       fontSize: 9,
//     },
//     headStyles: {
//       fillColor: [22, 160, 133], // green header
//     },
//   });

//   // Save PDF
//   doc.save(`${party.name}-ledger.pdf`);
// };


  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Transactions
      </Typography>

      {/* 🔍 Search */}
      <TextField
        fullWidth
        placeholder="Search party..."
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📋 Party List */}
      {filtered.map((p) => (
  <Card
    key={p.id}
    sx={{
      mb: 2,
      borderRadius: 3,
      boxShadow: 2,
      transition: "0.2s",
      "&:hover": {
        boxShadow: 6,
        transform: "scale(1.01)",
      },
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left */}
      <Box>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => router.push(`/ledger/${p.id}`)}
        >
          {p.name}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Click to view ledger
        </Typography>
      </Box>

      {/* Right Buttons */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={() => handleOpen(p, "receive")}
        >
          Receive
        </Button>

        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => handleOpen(p, "payment")}
        >
          Payment
        </Button>
      </Box>
    </CardContent>

    {/* Bottom Action */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        px: 2,
        pb: 2,
      }}
    >
      <PDFHandler party={p} act={"preview"} />
    </Box>
  </Card>
))}

      {/* 🧾 Modal */}
     <TransactionDialog
  open={open}
  onClose={() => setOpen(false)}
  onSave={handleSave}/>
    </Box>
  );
}