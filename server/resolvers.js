import { Sequelize, DataTypes } from "sequelize";
import { GraphQLScalarType, Kind } from "graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { format } from "date-fns";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom scalar type for Date",
  serialize(value) {
    return format(new Date(value), "yyyy-MM-dd");
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const User = sequelize.define(
  "User",
  {
    username: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "users", timestamps: false }
);

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: { type: DataTypes.STRING, allowNull: false },
    expensename: { type: DataTypes.STRING, allowNull: false },
    note: { type: DataTypes.STRING, allowNull: true },
    amount: { type: DataTypes.FLOAT },
    date: { type: DataTypes.DATE, allowNull: false },
    category: {
      type: DataTypes.ENUM("Food", "Groceries", "Rent", "Fuel", "Utilities"),
      allowNull: false,
    },
  },
  { tableName: "expenses", timestamps: false }
);

Expense.belongsTo(User, { foreignKey: "username" });
User.hasMany(Expense, { foreignKey: "username" });

const resolvers = {
  Date: dateScalar,

  Query: {
    getExpenseByUser: async (_, { username }, context) => {
      if (!context.user) {
        throw new Error("Authentication required!");
      }
      return await Expense.findAll({ where: { username } });
    },

    getExpenseById: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error("Authentication required!");
      }
      return await Expense.findByPk(id);
    },
  },

  User: {
    expenses: async (parent) => {
      return await Expense.findAll({ where: { username: parent.username } });
    },
  },

  Mutation: {
    signup: async (_, { username, email, phone, password }) => {
      if (
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[!@#$%^&*]/.test(password)
      ) {
        throw new Error(
          "Password must be at least 6 characters long, containing uppercase, lowercase, a digit, and a special character."
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      const user = await User.create({
        username,
        email,
        phone,
        password: hashedPassword,
      });

      return {
        username: user.username,
        email: user.email,
        phone: user.phone,
        password: user.password,
      };
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "120s" });
      return { token, user };
    },

    logout: async (_, { username }, context) => {
      if (!context.user) {
        throw new Error("Authentication required!");
      }

      if (context.user.username !== username) {
        throw new Error("Unauthorized: User mismatch!");
      }

      return "Logout successful";
    },

    addExpense: async (
      _,
      { expensename, note, amount, date, category },
      context
    ) => {
      if (!context.user) {
        throw new Error("Authentication required!");
      }
      return await Expense.create({
        username: context.user.username,
        expensename,
        note,
        amount,
        date,
        category,
      });
    },

    deleteExpense: async (_, { expenseID }, context) => {
      if (!context.user) {
        throw new Error("Authentication required!");
      }

      const expense = await Expense.findOne({
        where: { id: expenseID, username: context.user.username },
      });
      if (!expense) {
        throw new Error("Expense not found or unauthorized");
      }

      await Expense.destroy({ where: { id: expenseID } });
      return "Expense deleted successfully";
    },

    updateExpense: async (
      _,
      { id, expensename, note, amount, date, category },
      context
    ) => {
      if (!context.user) {
        throw new Error("Authentication required!");
      }

      const [updatedRows] = await Expense.update(
        { expensename, note, amount, date, category },
        { where: { id } }
      );

      if (updatedRows === 0) {
        throw new Error("Expense not found or unauthorized");
      }

      return await Expense.findByPk(id);
    },
  },
};

export default resolvers;
