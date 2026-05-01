import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

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