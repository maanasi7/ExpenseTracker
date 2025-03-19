import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_EXPENSE } from "../graphql/mutation";
import { GET_EXPENSE_BY_ID, EXPENSE_CATEGORIES } from "../graphql/query";
import useAuth from "../hooks/useAuth";

import { Input, Button, Radio, RadioGroup } from "@mui/joy";
import Typography from "@mui/material/Typography";

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const isTokenValid = useAuth();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  console.log(`Edit Expenses : ${isTokenValid}, ${username}, ${token}`);

  const { data, loading } = useQuery(GET_EXPENSE_BY_ID, { variables: { id } });

  const [formData, setFormData] = useState({
    username: localStorage.getItem("username") || "",
    id: id,
    expensename: "",
    note: "",
    amount: 0,
    date: "",
    category: "",
  });

  useEffect(() => {
    if (data?.getExpenseById) {
      setFormData({
        username: localStorage.getItem("username") || "",
        id: id,
        expensename: data.getExpenseById.expensename || "",
        note: data.getExpenseById.note || "",
        amount: data.getExpenseById.amount || 0,
        date: formatDate(data.getExpenseById.date) || "",
        category: data.getExpenseById.category || "",
      });
    }
  }, [data, id]);

  const [updateExpense] = useMutation(UPDATE_EXPENSE, {
    onCompleted: () => {
      alert("Expense updated successfully!");
      navigate("/dashboard");
      window.location.reload();
    },
    onError: (error) => setError(error.message),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isTokenValid) {
      alert("Your session has expired. Please log in again.");
      navigate("/");
      return;
    }

    try {
      await updateExpense({
        variables: {
          username: formData.username,
          id: formData.id,
          expensename: formData.expensename,
          note: formData.note || "",
          amount: parseFloat(formData.amount),
          date: formatDate(formData.date),
          category: formData.category,
        },
      });
    } catch (err) {
      console.error("Error updating expense:", err);
      setError(err.message || "Failed to update expense");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  if (loading) return <p>Loading...</p>;

  if (!isTokenValid) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "70px",
      }}
    >
      <Typography
        level="h6"
        color="neutral"
        textAlign="center"
        sx={{ marginBottom: "10px" }}
      >
        Edit Expense
      </Typography>

      {error && (
        <Typography color="danger" sx={{ marginBottom: 4 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit} style={{ width: "50%" }}>
        <Input
          id="expensename"
          name="expensename"
          type="text"
          value={formData.expensename}
          onChange={handleChange}
          required
          placeholder="Expense Name"
          variant="solid"
          sx={{ marginBottom: 1 }}
        />

        <Input
          id="note"
          name="note"
          type="text"
          value={formData.note}
          onChange={handleChange}
          placeholder="Description"
          variant="solid"
          sx={{ marginBottom: 1 }}
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
          sx={{ marginBottom: 1 }}
        />

        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          variant="solid"
          sx={{ marginBottom: 1 }}
        />

        <RadioGroup
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          orientation="horizontal"
          sx={{
            marginBottom: 1,
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

        <Button type="submit">Update Expense</Button>
      </form>
    </div>
  );
}

export default EditExpense;
