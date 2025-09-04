import React, { useState } from "react";

function EntryForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !username || !password) return;
    onAdd(title, username, password);
    setTitle("");
    setUsername("");
    setPassword("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-xl bg-dark border border-primary/30 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent shadow-inner"
      />

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full rounded-xl bg-dark border border-secondary/30 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary shadow-inner"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl bg-dark border border-accent/30 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent shadow-inner"
      />

      <button
        type="submit"
        className="mt-6 w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white font-bold py-2 rounded-xl shadow-md transition"
      >
        Add Entry
      </button>
    </form>
  );
}

export default EntryForm;
