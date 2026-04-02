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
//     { header: "Name", dataKey: "pName" },
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
//       Name: t.pName,
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
 
            {/* <Button
            sx={{textAlign:'flex-end',mr:'5%'}}
                  size="small"
                  color="primary"
                  onClick={() => handleDownload(p)}
                  >
                    Download
                 </Button> */}
                  <PDFHandler party={p} act={"preview"}/>
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

<Box display="flex" gap={2}>
  <Button
    variant="contained"
    fullWidth
    onClick={
      handleSave
    }
  >
    Save
  </Button>
          <Button variant="contained" fullWidth onClick={handleSave}>
            Save
          </Button>
            <PDFHandler party={{ ...form, data: [form] }} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}