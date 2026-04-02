import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";

const defaultForm = {
  type: "receive",
  pName: "",
  amount: "",
  mode: "cash",
  date: "",
  details: "",
};

const TransactionDialog = ({
  open,
  onClose,
  onSave,
  initialValues = null,
  section = "",
}) => {
  const isEdit = Boolean(initialValues);

  const [form, setForm] = useState(isEdit?initialValues:defaultForm);

  console.log(form,isEdit, "form values")
 useEffect(() => {
    if (initialValues) {
      setForm({ ...defaultForm, ...initialValues });
    } else {
      setForm(defaultForm);
    }
  }, [initialValues, open]);
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onSave?.(form);
    setForm(defaultForm);
  };

  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEdit
          ? "Edit Transaction"
          : form.type === "receive"
          ? "Receive"
          : "Payment"}
      </DialogTitle>

      <DialogContent>
        {/* Conditional Name Field */}
        {section === "category" && (
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.pName}
            onChange={(e) => handleChange("pName", e.target.value)}
          />
        )}

        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="normal"
          value={form.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
        />

        <TextField
          select
          label="Mode"
          fullWidth
          margin="normal"
          value={form.mode}
          onChange={(e) => handleChange("mode", e.target.value)}
        >
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="bank">Bank</MenuItem>
        </TextField>

        <TextField
          type="date"
          fullWidth
          margin="normal"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Details"
          fullWidth
          margin="normal"
          value={form.details}
          onChange={(e) => handleChange("details", e.target.value)}
        />

        {/* Actions */}
        <Box display="flex" gap={2} mt={2}>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            {isEdit ? "Update" : "Save"}
          </Button>

          

        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;