export default function EntryForm({ title, username, password, setTitle, setUsername, setPassword, onAdd }) {
  return (
    <div>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={onAdd}>Add Entry</button>
    </div>
  );
}