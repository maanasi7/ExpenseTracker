import { Box, Container, Divider, Grid, Paper } from "@mui/material";
import ExpenseList from "./ExpenseList";
import AddExpense from "./AddExpense";
import Statistics from "./Statistics";
import Navbar from "./Navbar";
import useAuth from "../hooks/useAuth";

function Dashboard() {
  const isTokenValid = useAuth();

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  console.log(`Dashboard : ${isTokenValid}, ${username}, ${token}`);

  if (!isTokenValid) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Box sx={{ py: 3 }}>
        <Container>
          <Grid container spacing={4} sx={{ marginBottom: 4 }}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3 }}>
                <AddExpense username={username} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3 }}>
                <Statistics username={username} />
              </Paper>
            </Grid>
          </Grid>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <ExpenseList username={username} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Dashboard;
