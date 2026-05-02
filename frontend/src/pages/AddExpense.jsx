import { useState } from "react";
import API from "../services/api"; 
import Navbar from "../components/Navbar";
import bgImage from "../assets/bg.png";

const AddExpense = () => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense", // ✅ ADD THIS
    category: "",
    isNecessary: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post("/transactions", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Expense Added ✅");

    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <>
    <Navbar />
    <div
      className="min-h-screen p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
    
      <h2>Add Expense</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} />
        <input name="amount" placeholder="Amount" onChange={handleChange} />
        <input name="category" placeholder="Category" onChange={handleChange} />

        <label>
          Necessary?
          <input
            type="checkbox"
            name="isNecessary"
            checked={form.isNecessary}
            onChange={handleChange}
          />
        </label>
        <select name="type" onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
        </select>

        <button type="submit">Add</button>
      </form>
    </div>
    </>
  );
};

export default AddExpense;