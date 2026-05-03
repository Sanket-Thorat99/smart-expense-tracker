import { useNavigate } from "react-router-dom";
import {useState} from "react";
import API from "../services/api";
import bgImage from "../assets/bg3.png";

const Login = ()=>{
    const navigate = useNavigate();
    const [form,setForm] = useState({
        email: "",
        password : ""
    });

    const [error,setError] = useState("");

    const handleChange= (e)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", form);

            console.log("TOKEN:", res.data.token);

            localStorage.setItem("token", res.data.token);

            alert("Login Successful ✅");

            navigate("/dashboard");

        } catch (err) {
            console.log(err.response);
            setError(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        
            <div
              className="min-h-screen p-6 bg-cover bg-center flex items-center justify-center h-screen bg-gray-100"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-80"
        >
            <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

            {error && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
            )}

            <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
            required
            />

            <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
            required
            />

            <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
            >
            Login
            </button>
            <p className="text-sm mt-3">
                Don’t have an account?{" "}
                <span
                    onClick={() => navigate("/register")}
                    className="text-blue-500 cursor-pointer"
                >
                    Register
                </span>
            </p>
        </form>
        </div>
    );
};

export default Login;