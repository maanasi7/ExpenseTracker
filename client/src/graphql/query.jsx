import { gql } from "@apollo/client";

export const GET_EXPENSE_BY_USER = gql`
  query GetExpenseByUser($username: String!) {
    getExpenseByUser(username: $username) {
      id
      username
      expensename
      note
      amount
      date
      category
    }
  }
`;

export const EXPENSE_CATEGORIES = [
  "Groceries",
  "Rent",
  "Fuel",
  "Utilities",
  "Food",
];

export const GET_EXPENSE_BY_ID = gql`
  query GetExpenseById($id: ID!) {
    getExpenseById(id: $id) {
      id
      expensename
      note
      amount
      date
      category
    }
  }
`;
