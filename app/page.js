"use client";

import './home.css'; // Import the CSS file
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const navigateToTriage = () => {
    router.push('/triage');
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    const username = getCookie('username');
    if (username) {
      navigateToTriage();
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);
        document.cookie = `username=${username}; path=/;`;
        navigateToTriage();
      } else {
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <header className="page-header">
        <h1>APU Student Visit 2024 Bug Squasher - Login</h1>
      </header>
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}