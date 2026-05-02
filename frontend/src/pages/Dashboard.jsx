import { useEffect, useState } from "react";
import API from "../services/api";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});

  const chartData = {
  labels: ["Necessary", "Unnecessary"],
  datasets: [
    {
      data: [
        summary.totalExpense - summary.unnecessaryExpense || 0,
        summary.unnecessaryExpense || 0
      ]
    }
    ]
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data);
        const summaryRes = await API.get("/transactions/summary");
        setSummary(summaryRes.data);
      } catch (err) {
        console.log(err.response);
      }
    };

    fetchData();
    const handleDelete = async (id) => {
        try {
            await API.delete(`/transactions/${id}`);
            setTransactions(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    };
  }, []);

  return (
  <div className="min-h-screen bg-gray-100 p-6">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">💰 Expense Tracker</h1>

      <button
        onClick={() => navigate("/add")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
      >
        + Add Expense
      </button>
    </div>

    {/* SUMMARY CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

      <div className="bg-white p-5 rounded-2xl shadow">
        <p className="text-gray-500">Total Expense</p>
        <h2 className="text-2xl font-bold text-red-500">
          ₹{summary.totalExpense || 0}
        </h2>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow">
        <p className="text-gray-500">Unnecessary</p>
        <h2 className="text-2xl font-bold text-yellow-500">
          ₹{summary.unnecessaryExpense || 0}
        </h2>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow">
        <p className="text-gray-500">Advice</p>
        <p className="text-sm mt-2">{summary.advice}</p>
      </div>

    </div>

    {/* CHART */}
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h3 className="font-semibold mb-4">📊 Spending Analysis</h3>
      <div className="w-72 mx-auto">
        <Pie data={chartData} />
      </div>
    </div>

    {/* TRANSACTIONS */}
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-semibold mb-4">📋 Transactions</h3>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet</p>
      ) : (
        transactions.map((t) => (
          <div
            key={t._id}
            className="flex justify-between items-center p-3 border-b hover:bg-gray-50 rounded"
          >
            <div>
              <p className="font-medium">{t.title}</p>
              <p className="text-sm text-gray-500">{t.category}</p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={
                  t.type === "expense"
                    ? "text-red-500 font-semibold"
                    : "text-green-500 font-semibold"
                }
              >
                ₹{t.amount}
              </span>

              <button
                onClick={() => handleDelete(t._id)}
                className="text-red-400 hover:text-red-600 text-sm"
                >
                Delete
            </button>
            </div>
          </div>
        ))
      )}
    </div>

  </div>
);
};

export default Dashboard;