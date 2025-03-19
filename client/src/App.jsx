import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import EditExpense from "./components/EditExpense";
import DeleteExpense from "./components/DeleteExpense";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit/:id" element={<EditExpense />} />
        <Route path="/delete/:id" element={<DeleteExpense />} />
      </Routes>
    </Router>
  );
}

export default App;
