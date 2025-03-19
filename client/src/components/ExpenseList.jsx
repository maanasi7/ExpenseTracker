import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_BY_USER } from "../graphql/query";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function ExpenseList({ username }) {
  const navigate = useNavigate();

  const isTokenValid = useAuth();
  const token = localStorage.getItem("token");
  console.log(`ExpensesList : ${isTokenValid}, ${username}, ${token}`);

  if (!isTokenValid) return null;

  const { loading, error, data } = useQuery(GET_EXPENSE_BY_USER, {
    variables: { username },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const expenses = data?.getExpenseByUser || [];

  return (
    <Container maxWidth="lg">
      <Typography variant="h6" component="h3" color="neutral" sx={{ mb: 1 }}>
        Expenses
      </Typography>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Expense Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Note</strong>
                </TableCell>
                <TableCell>
                  <strong>Amount ($)</strong>
                </TableCell>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Edit</strong>
                </TableCell>
                <TableCell>
                  <strong>Delete</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.expensename}</TableCell>
                  <TableCell>{expense.note}</TableCell>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <EditIcon
                      onClick={() => navigate(`/edit/${expense.id}`)}
                      fontSize="large"
                    />
                  </TableCell>
                  <TableCell>
                    <DeleteIcon
                      onClick={() => navigate(`/delete/${expense.id}`)}
                      fontSize="large"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default ExpenseList;
