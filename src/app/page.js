"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Typography, Grid } from "@mui/material";

export default function Dashboard() {
  const router = useRouter();

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        DigiKhata Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/master")}
          >
            Master
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/transactions")}
          >
            Transactions
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/report")}
          >
            Report
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button fullWidth variant="contained">
            Sales (Coming)
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button fullWidth variant="contained">
            Purchase (Coming)
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}