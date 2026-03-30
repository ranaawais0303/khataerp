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

import { useRouter } from "next/navigation";


export default function Transactions() {
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [form, setForm] = useState({
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
    setSelectedParty(party);
    setForm({ ...form, type });
    setOpen(true);
  };

  // 💾 Save Transaction
  const handleSave = async () => {
  if (!selectedParty) {
    alert("No party selected ❌");
    return;
  }

  if (!form.amount) {
    alert("Enter amount ❌");
    return;
  }

  await fetch("/api/transactions", {
    method: "POST",
    body: JSON.stringify({
      ...form,
      party_id: selectedParty.id,
    }),
  });

  alert("Transaction Saved ✅");
  setOpen(false);
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
        </Card>
      ))}

      {/* 🧾 Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {form.type === "receive" ? "Receive" : "Payment"}
        </DialogTitle>

        <DialogContent>
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