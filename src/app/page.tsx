"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const router = useRouter();

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <main className="h-screen flex flex-col justify-center items-center gap-8 bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full lg:w-1/3">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">Username</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
      <div className="flex flex-col justify-start items-start gap-2 w-full lg:w-1/3 p-4">
        <p className=" text-gray-600 font-bold">Note:</p>
        <p className="text-sm text-gray-500">
          The login credentials provided are for demonstration purposes only.
          Please use the following credentials to access the admin dashboard:
        </p>
        <ul className="text-sm text-gray-500 list-disc list-inside">
          <li>
            <strong>Username:</strong> admin
          </li>
          <li>
            <strong>Password:</strong> admin
          </li>
        </ul>
      </div>
    </main>
  );
}
