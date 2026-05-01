import { useEffect, useState } from "react";
import API from "../api";

const Summary = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem("token");

      const res = await API.get("/transactions/summary", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setData(res.data);
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <h2>Summary</h2>
      <p>Total: ₹{data.totalExpense}</p>
      <p>Unnecessary: ₹{data.unnecessaryExpense}</p>
      <p>{data.message}</p>
    </div>
  );
};

export default Summary;