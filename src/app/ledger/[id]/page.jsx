"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import PDFHandler from "@/app/components/PDFHandler";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TransactionDialog from "@/app/components/TransactionDialog";

export default function Ledger() {
  const { id } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // 📥 Fetch transactions
  useEffect(() => {
    fetch("/api/transactions", {
      method: "PUT",
      body: JSON.stringify({ party_id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map((t) => ({
          ...t,
          amount: parseFloat(t.amount),
        }));

        // ✅ running balance (optional for each row)
        let runningBalance = 0;

        const withBalance = parsed.map((t) => {
          if (!t.archived) {
            if (t.type === "receive") runningBalance += t.amount;
            else runningBalance -= t.amount;
          }

          return {
            ...t,
            balance: runningBalance,
          };
        });

        setTransactions(withBalance);
      });
  }, [id, selectedTransaction]);

  // ✅ TOTAL BALANCE (excluding archived)
  const totalBalance = transactions
    .filter((t) => !t.archived)
    .reduce((acc, t) => {
      return t.type === "receive"
        ? acc + t.amount
        : acc - t.amount;
    }, 0);

  // ✏️ Edit
  const handleEdit = (t) => {
    const transaction = { ...t };

    if (transaction.date) {
      transaction.date = new Date(transaction.date)
        .toISOString()
        .split("T")[0];
    }

    setSelectedTransaction(transaction);
    setOpen(true);
  };

  // 💾 Save (Add / Edit)
  const handleSave = async (form) => {
    try {
      if (!form.amount) {
        alert("Amount is required ❌");
        return;
      }

      if (form.id) {
        // Update
        await fetch("/api/transactions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        alert("Transaction updated ✅");
      } else {
        // Create
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            party_id: id,
          }),
        });
        alert("Transaction added ✅");
      }

      setOpen(false);
      setSelectedTransaction(null);
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑 Delete
  const handleArchive = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    alert("Transaction archived ✅");
  };

  return (
    <Box p={3}>
      {/* 🔝 Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          Ledger {transactions[0]?.name || ""}
        </Typography>

        <Typography fontWeight="bold">
          Balance: {totalBalance}
        </Typography>
      </Box>

      {/* 📋 Transactions */}
      {transactions.map((t, i) => {
        if (t.archived) return null;

        const borderColor =
          t.type === "receive" ? "#2e7d32" : "#d32f2f";

        return (
          <Card
            key={i}
            sx={{
              mb: 2,
              borderRadius: 3,
              boxShadow: 3,
              borderLeft: `6px solid ${borderColor}`,
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
              }}
            >
              {/* Left */}
              <Box>
                <Typography fontWeight="bold">
                  {t.type === "receive"
                    ? "Received from"
                    : "Paid to"}{" "}
                  {t.pName}
                </Typography>

                <Typography variant="body2">
                  {t.details}
                </Typography>
              </Box>

              {/* Right */}
              <Box textAlign="right">
                <Typography variant="caption">
                  {t.date}
                </Typography>

                <Typography
                  sx={{
                    color:
                      t.type === "receive"
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {t.type === "receive" ? "+" : "-"} Rs{" "}
                  {t.amount}
                </Typography>

                <PDFHandler
                  party={{ ...t, data: [t] }}
                  act="preview"
                />

                <IconButton
                  onClick={() => handleEdit(t)}
                  color="primary"
                >
                  <EditSquareIcon />
                </IconButton>

                <IconButton
                  onClick={() => handleArchive(t.id)}
                  color="error"
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        );
      })}

      {/* 🧾 Dialog */}
      <TransactionDialog
        open={open}
        onClose={() => setOpen(false)}
        initialValues={selectedTransaction}
        onSave={handleSave}
      />
    </Box>
  );
}