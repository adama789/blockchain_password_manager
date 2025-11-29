import React, { useState } from "react";
import { Eye, EyeOff, Dice5 } from "lucide-react";

function EntryForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let newPassword = "";
    
    newPassword += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    newPassword += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    newPassword += "0123456789"[Math.floor(Math.random() * 10)];
    newPassword += "!@#$%^&*()_+~`|}{[]:;?><,./-="[Math.floor(Math.random() * 27)];
    
    for (let i = newPassword.length; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');

    setPassword(newPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !username || !password) return;
    onAdd(title, username, password);
    setTitle("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
  };

  const inputClass =
    "w-full rounded-xl font-semibold bg-dark/60 border border-primary/50 shadow-[0_0_300px_rgba(199,94,255,0.15)] " +
    "p-3 pr-24 text-accent placeholder-accent/50 focus:outline-none " +
    "focus:ring-2 focus:ring-accent shadow-inner transition";
    
  const buttonBaseClass = "absolute top-1/2 -translate-y-1/2 transition font-bold p-1 rounded-full";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        placeholder="Title..."
        value={title}
        maxLength={64}
        onChange={(e) => setTitle(e.target.value)}
        className={inputClass.replace('pr-24', 'pr-12')} 
      />

      <input
        placeholder="Username..."
        value={username}
        maxLength={64}
        onChange={(e) => setUsername(e.target.value)}
        className={inputClass.replace('pr-24', 'pr-12')}
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password..."
          maxLength={64}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass} 
        />
        
        <button
          type="button"
          onClick={generatePassword}
          className={`${buttonBaseClass} right-11 text-primary/90 hover:bg-primary/20`}
          title="Generate strong password"
        >
          <Dice5 className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`${buttonBaseClass} right-2 text-primary/90 hover:bg-primary/20`}
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" /> }
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-accent 
                   text-white font-bold py-3 rounded-xl transition duration-300 
                   shadow-[0_0_40px_rgba(199,94,255,0.4)] hover:shadow-[0_0_60px_rgba(199,94,255,0.6)]
                   transform hover:scale-[1.01]"
      >
        ADD ENTRY
      </button>
    </form>
  );
}

export default EntryForm;