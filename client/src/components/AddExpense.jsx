import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ADD_EXPENSE } from "../graphql/mutation";
import { EXPENSE_CATEGORIES } from "../graphql/query";
import { Input, Button, Radio, RadioGroup } from "@mui/joy";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import useAuth from "../hooks/useAuth";

function AddExpense({ username }) {
  const navigate = useNavigate();

  const isTokenValid = useAuth();
  const token = localStorage.getItem("token");
  console.log(`Add Expenses : ${isTokenValid}, ${username}, ${token}`);

  const [formData, setFormData] = useState({
    username: username || "",
    expensename: "",
    note: "",
    amount: 0,
    date: "",
    category: "",
  });
  const [error, setError] = useState("");

  const [addExpenseMutation] = useMutation(ADD_EXPENSE, {
    onCompleted: () => {
      navigate("/dashboard");
      window.location.reload(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "amount"
          ? value === ""
            ? ""
            : parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpenseMutation({ variables: formData });
  };

  if (!isTokenValid) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ p: 2 }}>
      <Typography variant="h6" component="h3" color="neutral" sx={{ mb: 1 }}>
        Add Expense
      </Typography>

      {error && (
        <Typography color="danger" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          id="expensename"
          name="expensename"
          type="text"
          value={formData.expensename}
          onChange={handleChange}
          required
          placeholder="Expense Name"
          variant="solid"
          sx={{ mb: 1 }}
        />

        <Input
          id="note"
          name="note"
          type="text"
          value={formData.note}
          onChange={handleChange}
          placeholder="Description"
          variant="solid"
          sx={{ mb: 1 }}
        />

        <Input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
          placeholder="Amount"
          variant="solid"
          sx={{ mb: 1 }}
        />

        <Input
          id="date"
          name="date"
          type="date"
          value={
            formData.date
              ? new Date(formData.date).toISOString().split("T")[0]
              : ""
          }
          onChange={handleChange}
          required
          variant="solid"
          sx={{ mb: 1 }}
        />

        <RadioGroup
          id="category"
          name="category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
          orientation="horizontal"
          sx={{
            mb: 1,
            padding: 1,
            color: "white",
            alignItems: "center",
            textAlign: "center",
          }}
          variant="solid"
        >
          {EXPENSE_CATEGORIES.map((cat, idx) => (
            <Radio
              key={idx}
              value={cat}
              label={cat}
              variant="outlined"
              sx={{ color: "white" }}
            />
          ))}
        </RadioGroup>

        <Button type="submit" sx={{ mt: 1 }}>
          Add Expense
        </Button>
      </form>
    </Container>
  );
}

export default AddExpense;
