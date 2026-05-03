import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import bgImage from "../assets/bg2.png";

import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [budget, setBudget] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const chartDataMonthly = {
  labels: monthlyData.map(d => months[d._id - 1]),
  datasets: [
    {
      label: "Monthly Spending",
      data: monthlyData.map(d => d.total),
      borderWidth: 2
    }
  ]
};

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

    const remaining = budget - (summary.totalExpense || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data);
        const summaryRes = await API.get("/transactions/summary");
        setSummary(summaryRes.data);
        const monthlyRes = await API.get("/transactions/monthly");
        setMonthlyData(monthlyRes.data);
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
    <><Navbar />
  <div
  className="min-h-screen p-6 bg-cover bg-center"
  style={{ backgroundImage: `url(${bgImage})` }}
>
    <div className="mb-6 bg-white p-4 rounded-xl shadow">
    <h3 className="mb-2 font-semibold">Set Monthly Budget</h3>

    <input
        type="number"
        placeholder="Enter budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="border p-2 rounded w-full"
    />
    </div>

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

    <div className="mb-6">
        {budget > 0 && (
            remaining < 0 ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                ⚠️ You exceeded your budget by ₹{Math.abs(remaining)}
            </div>
            ) : (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg">
                ✅ You are within budget. Remaining: ₹{remaining}
            </div>
            )
        )}
    </div>

    {/* CHART */}
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h3 className="font-semibold mb-4">📊 Spending Analysis</h3>
      <div className="w-72 mx-auto">
        <Pie data={chartData} />
      </div>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow mb-6">
    <h3 className="font-semibold mb-4">📈 Monthly Trend</h3>

    <Line data={chartDataMonthly} />
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
  </>
);
};

export default Dashboard;