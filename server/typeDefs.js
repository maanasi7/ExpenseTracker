import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type User {
    username: String!
    email: String!
    phone: String!
    password: String!
    expenses: [Expense!]!
  }

  type Expense {
    id: ID!
    username: String!
    expensename: String!
    note: String
    amount: Float!
    date: Date!
    category: Category!
  }

  enum Category {
    Food
    Groceries
    Rent
    Fuel
    Utilities
    Entertainment
    Healthcare
    Other
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getExpenseByUser(username: String!): [Expense!]!
    getExpenseById(id: ID!): Expense!
  }

  type Mutation {
    signup(
      username: String!
      email: String!
      phone: String!
      password: String!
    ): User!
    login(username: String!, password: String!): AuthPayload!
    logout(username: String!): String!
    addExpense(
      username: String!
      expensename: String!
      note: String
      amount: Float!
      date: Date!
      category: Category!
    ): Expense!
    deleteExpense(expenseID: ID!): String!
    updateExpense(
      id: ID!
      expensename: String!
      note: String
      amount: Float!
      date: Date!
      category: Category!
    ): Expense!
  }
`;

export default typeDefs;
