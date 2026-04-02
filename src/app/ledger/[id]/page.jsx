"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
} from "@mui/material";
import PDFHandler from "@/app/components/PDFHandler";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TransactionDialog from "@/app/components/TransactionDialog";

export default function Ledger() {
  const { id } = useParams();

  const [transactions, setTransactions] = useState([]);
const [open, setOpen] = useState(false);
const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [category, setCategory]=useState("")

  // 📥 Fetch transactions
  useEffect(() => {
    fetch("/api/transactions", {
      method: "PUT",
      body: JSON.stringify({ party_id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        // ✅ Convert amount to number
        const parsed = data.map((t) => ({
          ...t,
          amount: parseFloat(t.amount),
        }));

        // ✅ Calculate running balance
        let runningBalance = 0;

        const withBalance = parsed.map((t) => {
          if (t.type === "receive") {
            runningBalance += t.amount;
          } else {
            runningBalance -= t.amount;
          }

          return {
            ...t,
            balance: runningBalance,
          };
        });

        setTransactions(withBalance);
      });
  }, [id,selectedTransaction]);
const handleEdit =  (d) => {
  console.log(d,"id from transactions");
  const transaction= d
     if (transaction.date) {
        transaction.date = new Date(transaction.date)
          .toISOString()
          .split("T")[0];
      }
  

    // Store it in state
    
    // Open dialog
    setOpen(true);
    setSelectedTransaction(transaction);

};

const handleSave = async (form) => {
    try {
      if (!form.amount) {
        alert("Amount is required ❌");
        return;
      }

      if (form.id) {
        // Edit → PATCH request
        await fetch("/api/transactions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        alert("Transaction updated ✅");
      } else {
        // Add → POST request
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        alert("Transaction added ✅");
      }

      setOpen(false);
      setSelectedTransaction(null);
    } catch (err) {
      console.error("Error saving transaction:", err);
    }
  };

  //Delete
    const handleArchive = async (id) => {
    if (!window.confirm("Are you sure you want to archive this transaction?")) return;
    try {
      await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      alert("Transaction archived ✅");
    } catch (err) {
      console.error("Error archiving transaction:", err);
    }
  };

  return (
    
    <Box p={3}>
   
<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  
  <Typography variant="h5">
    Ledger {category ? category.name : ""}
  </Typography>

  <Typography fontWeight="bold">
    Balance: {category?.balance}
  </Typography>

</Box>
      
               
            
      {transactions.map((t, i) => {
  //      const bgColor =
  // t.type === "receive" ? "#e8f5e9" : "#fdecea"; // soft bg

const borderColor =
  t.type === "receive" ? "#2e7d32" : "#d32f2f";
        
        setCategory(t)
        return (!t.archieved&&<Box key={i}>  
        <Card key={i} s  sx={{
    mb: 2,
    borderRadius: 3,
    boxShadow: 3,
    bgcolor: "#fff",
    borderLeft: `6px solid ${borderColor}`,
    transition: "0.2s",
    "&:hover": {
      boxShadow: 6,
      transform: "scale(1.01)",
    },
  }} >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Left Side */}
            <Box>
              <Typography fontWeight="bold">
                {t.type === "receive" ? "Received from" : "Paid to"} {t.pName}
              </Typography>

              <Typography variant="body2">
                {t.details}
              </Typography>
            </Box>

            {/* Right Side */}
            <Box textAlign="right">

            <Typography variant="caption">
              {t.date}
            </Typography>
              <Typography
                sx={{
                  color: t.type === "receive" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {t.type === "receive" ? "+" : "-"} Rs {t.amount}
              </Typography>
              <PDFHandler party={{ ...t, data: [t] }}  act={"preview"}/>
                <IconButton onClick={()=>handleEdit(t)} color="primary">
      <EditSquareIcon />
      </IconButton>
      <IconButton onClick={() => handleArchive(t.id)} color="error">
      <DeleteForeverIcon />
      </IconButton>

            {/* party={[t]} */}
              {/* <PDFHandler party={t} act={"preview"}/> */}
            </Box>
          </CardContent>
        </Card>
        <TransactionDialog
  open={open}
  onClose={() => setOpen(false)}
  initialValues={selectedTransaction} // 👈 Prefills the form
  onSave={handleSave}
/>
        </Box>)
})}
    </Box>
  );
}