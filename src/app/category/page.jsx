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


export default function Category() {
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [form, setForm] = useState({
    pName:"",
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
    fetch("/api/category")
      .then((res) => res.json())
      .then(setParties);
  }, []);

  // 🔍 Filter
  const filtered = parties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ➕ Open Modal
  const handleOpen = (party, type) => {
    setSelectedParty(party);
    setForm({ ...form, type });
    setOpen(true);
  };

  // 💾 Save Transaction with category
  const handleSave = async () => {
  if (!selectedParty) {
    alert("No party selected ❌");
    return;
  }

  if (!form.amount) {
    alert("Enter amount ❌");
    return;
  }

  await fetch("/api/category", {
    method: "POST",
    body: JSON.stringify({
      ...form,
      party_id: selectedParty.id,
    }),
  });

  alert("Transaction Saved ✅");
  // 🧾 Generate PDF after save
 
const doc = new jsPDF();

// 🧾 Title (center)
doc.setFontSize(18);
doc.text("TRANSACTION INVOICE", 105, 10, { align: "center" });

// 📅 Right top (date & time)
const now = new Date();
doc.setFontSize(10);
doc.text(
  `Date: ${now.toLocaleDateString()}\nTime: ${now.toLocaleTimeString()}`,
  200,
  10,
  { align: "right" }
);

// 👤 Left top (customer)
doc.text(`Customer: ${selectedParty.name + ' (' +form.pName +')'}`, 10, 20);

// 📋 Table header
let y = 40;
doc.setFontSize(12);
doc.text("Details", 10, y);
doc.text("Amount", 160, y);

// ➖ Line
y += 5;
doc.line(10, y, 200, y);

// 📄 Data row
y += 10;
doc.text(form.details || "N/A", 10, y);
doc.text(`Rs. ${form.amount}`, 160, y);

// 💾 Save
doc.save(`${selectedParty.name}-invoice.pdf`);

  alert("Transaction Saved & PDF Downloaded ✅");

  setOpen(false);
};

//download pdf
const handleDownload = async (party) => {
  const res = await fetch(`/api/ledger?party_id=${party.id}`);
  const data = await res.json();

  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text(`Ledger Report - ${party.name}`, 14, 15);

  // Table Columns
  const columns = [
    { header: "Name", dataKey: "pName" },
    { header: "Date", dataKey: "date" },
    { header: "Type", dataKey: "type" },
    { header: "Amount", dataKey: "amount" },
    { header: "Mode", dataKey: "mode" },
    { header: "Details", dataKey: "details" },
    { header: "Balance", dataKey: "balance" },
  ];

  // Prepare Rows + Balance
  let balance = 0;

  const rows = data.map((t) => {
    if (t.type === "receive") balance += Number(t.amount);
    else balance -= Number(t.amount);

    return {
      Name: t.pName,
      date: t.date,
      type: t.type.toUpperCase(),
      amount: `Rs. ${t.amount}`,
      mode: t.mode,
      details: t.details || "-",
      balance: `Rs. ${balance}`,
    };
  });

  // Generate Table
  autoTable(doc, {
    startY: 25,
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => Object.values(row)),
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [22, 160, 133], // green header
    },
  });

  // Save PDF
  doc.save(`${party.name}-ledger.pdf`);
};

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
        <Card key={p.id}
    sx={{ mb: 1 }}
   >
          <CardContent
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography sx={{ mb: 1, cursor: "pointer" }}
    onClick={() => router.push(`/ledger/${p.id}`)}>{p.name}</Typography>

            <Box>
              <Button
                size="small"
                color="success"
                onClick={() => handleOpen(p, "receive")}
              >
                Receive
              </Button>

              <Button
                size="small"
                color="error"
                onClick={() => handleOpen(p, "payment")}
              >
                Payment
              </Button>
            </Box>
          </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
 
            <Button
            sx={{textAlign:'flex-end',mr:'5%'}}
                  size="small"
                  color="primary"
                  onClick={() => handleDownload(p)}
                  >
                    Download
                 </Button>
</Box>
        </Card>
      ))}

      {/* 🧾 Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {form.type === "receive" ? "Receive" : "Payment"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Name"
            type="text"
            fullWidth
            sx={{ mt: 1, mb: 2 }}
            onChange={(e) =>
              setForm({ ...form, pName: e.target.value })
            }
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            sx={{ mt: 1, mb: 2 }}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <TextField
            select
            label="Mode"
            fullWidth
            sx={{ mb: 2 }}
            value={form.mode}
            onChange={(e) =>
              setForm({ ...form, mode: e.target.value })
            }
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="bank">Bank</MenuItem>
          </TextField>

          <TextField
            type="date"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <TextField
            label="Details"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) =>
              setForm({ ...form, details: e.target.value })
            }
          />

          <Button variant="contained" fullWidth onClick={handleSave}>
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}