import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE_EXPENSE } from "../graphql/mutation";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Button } from "@mui/joy";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

function DeleteExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const isTokenValid = useAuth();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  console.log(`Delete Expenses : ${isTokenValid}, ${username}, ${token}`);

  const [deleteExpenseMutation] = useMutation(DELETE_EXPENSE, {
    variables: { expenseID: id },
    onCompleted: () => {
      alert("Expense deleted successfully!");
      navigate("/dashboard");
      window.location.reload(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleDelete = async () => {
    try {
      if (isTokenValid) {
        await deleteExpenseMutation();
      } else {
        alert("Your session has expired. Please log in again.");
        navigate("/");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="text-center">
      <Typography variant="h6" color="neutral" sx={{ mt: 7 }}>
        Delete Expense
      </Typography>
      <Typography variant="h7" color="neutral">
        Are you sure you want to delete the expense?
      </Typography>

      {error && (
        <Typography color="danger" aria-live="assertive">
          {error}
        </Typography>
      )}

      <Divider sx={{ mt: 2, mb: 2 }} />
      <Button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Confirm Delete
      </Button>
    </div>
  );
}

export default DeleteExpense;
