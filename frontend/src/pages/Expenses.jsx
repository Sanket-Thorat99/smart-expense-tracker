import { useEffect, useState } from "react";
import API from "../api";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");

      const res = await API.get("/transactions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setExpenses(res.data);
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <h2>All Expenses</h2>

      {expenses.map((exp) => (
        <div key={exp._id}>
          <p>{exp.title} - ₹{exp.amount}</p>
        </div>
      ))}
    </div>
  );
};

export default Expenses;