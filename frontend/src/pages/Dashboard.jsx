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
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
        <h3>Summary</h3>
        <p>Total Expense: ₹{summary.totalExpense}</p>
        <p>Unnecessary: ₹{summary.unnecessaryExpense}</p>
        <p>{summary.advice}</p>

        <h3>Spending Analysis</h3>

        <div style={{ width: "300px" }}>
        <Pie data={chartData} />
        </div>

      <h3>Your Transactions:</h3>

      {transactions.map((t) => (
        <div key={t._id}>
          <p>
            {t.title} - ₹{t.amount} ({t.type})
          </p>
          <button onClick={async () => {
            await API.delete(`/transactions/${t._id}`);
            window.location.reload(); // quick refresh
                            }}>
                Delete
            </button>
        </div>
        
      ))}
    </div>
  );
};

export default Dashboard;