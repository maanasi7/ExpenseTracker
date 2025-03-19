import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_EXPENSE_BY_USER } from "../graphql/query";
import { PieChart } from "@mui/x-charts/PieChart";
import { CircularProgress, Container, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";

function Statistics({ username }) {
  const isTokenValid = useAuth();

  const token = localStorage.getItem("token");
  console.log(`Statistics : ${isTokenValid}, ${username}, ${token}`);

  if (!isTokenValid) return null;

  const { loading, error, data } = useQuery(GET_EXPENSE_BY_USER, {
    variables: { username },
  });

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const expenses = data?.getExpenseByUser || [];

  const categoryTotals = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([category, total]) => ({
    id: category,
    value: total,
    label: category,
  }));

  return (
    <Container maxWidth="sm" sx={{ p: 2 }}>
      <Typography variant="h6" component="h3" color="neutral" sx={{ mb: 1 }}>
        Expense Statistics
      </Typography>

      {error && (
        <Typography color="danger" sx={{ mb: 1 }}>
          {error}
        </Typography>
      )}

      <PieChart
        sx={{ mb: 1 }}
        series={[
          {
            data: pieData,
            innerRadius: 20,
            outerRadius: 105,
            paddingAngle: 2,
          },
        ]}
        width={360}
        height={265}
      />
    </Container>
  );
}

export default Statistics;
