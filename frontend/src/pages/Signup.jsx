import { useState } from "react";
import API from "../services/api";

function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", { email, password });
      setMessage("Signup successful. Please login.");
    } catch {
      setMessage("Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Signup
        </h2>

        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-black text-white py-2 rounded-lg"
          onClick={handleSignup}
        >
          Signup
        </button>

        {message && (
          <p className="text-sm mt-2 text-center">{message}</p>
        )}

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
