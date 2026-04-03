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
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";

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
    setSelectedParty(party);
      setForm({
    ...formData,
    name: party.name,
    type: type,
  });
    setOpen(true);
  };



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
        <Grid item xs={12} sx={{ mb: '10px' ,display: "flex", justifyContent: "flex-end" }}>
      <Tooltip title="Add Party">
  <Button
    sx={{
    backgroundColor: "#268581",
    borderRadius: "50%",
    minWidth: "40px",   // 👈 smaller width
    height: "40px",     // 👈 smaller height
    padding: 0
  }}
    onClick={() => router.push("/master/add-party")}
  >
    <AddIcon sx={{ color: "#fff" }} />
  </Button>
    </Tooltip>
</Grid>
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