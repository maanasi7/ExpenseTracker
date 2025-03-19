import { gql } from "@apollo/client";

export const SIGNUP = gql`
  mutation Signup(
    $username: String!
    $email: String!
    $phone: String!
    $password: String!
  ) {
    signup(
      username: $username
      email: $email
      phone: $phone
      password: $password
    ) {
      username
      email
      phone
      password
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
        email
        phone
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout($username: String!) {
    logout(username: $username)
  }
`;

export const ADD_EXPENSE = gql`
  mutation AddExpense(
    $username: String!
    $expensename: String!
    $note: String
    $amount: Float!
    $date: Date!
    $category: Category!
  ) {
    addExpense(
      username: $username
      expensename: $expensename
      note: $note
      amount: $amount
      date: $date
      category: $category
    ) {
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

export const UPDATE_EXPENSE = gql`
  mutation UpdateExpense(
    $id: ID!
    $expensename: String!
    $note: String
    $amount: Float!
    $date: Date!
    $category: Category!
  ) {
    updateExpense(
      id: $id
      expensename: $expensename
      note: $note
      amount: $amount
      date: $date
      category: $category
    ) {
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

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($expenseID: ID!) {
    deleteExpense(expenseID: $expenseID)
  }
`;
