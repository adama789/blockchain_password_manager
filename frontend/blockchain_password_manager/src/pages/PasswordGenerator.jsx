import React, { useState, useCallback, useMemo } from 'react';
import { RefreshCw, Clipboard, Check, Zap, Lock } from 'lucide-react';
import Layout from "./Layout";

/** Constants for consistent branding colors within styles */
const primaryColorRGB = '184, 107, 255';
const accentColorRGB = '236, 72, 153';

/**
 * Utility: Detects the pool size (R) of the character set used in a password.
 * @param {string} password 
 * @returns {number} Size of the character pool
 */
const detectCharsetSize = (password) => {
  let R = 0;
  if (/[a-z]/.test(password)) R += 26;
  if (/[A-Z]/.test(password)) R += 26;
  if (/[0-9]/.test(password)) R += 10;
  if (/[^a-zA-Z0-9]/.test(password)) R += 32;
  return R || 1;
};

/**
 * Utility: Calculates information entropy in bits using the formula: E = L * log2(R)
 * where L is length and R is the character pool size.
 */
const calculateEntropyFromPassword = (password) => {
  if (!password.length) return 0;
  const R = detectCharsetSize(password);
  return password.length * Math.log2(R);
};

/**
 * Core Logic: Generates a random string based on user-defined criteria.
 */
const generatePassword = (length, options) => {
  let characters = '';
  if (options.uppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.lowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
  if (options.numbers) characters += '0123456789';
  if (options.symbols) characters += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!characters) return '';
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};

/**
 * PasswordGenerator Component
 * * A comprehensive tool for creating and auditing password strength.
 */
const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: false });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  // Target entropy for a 'perfect' score (100 bits is considered very strong)
  const maxEntropy = 100;

  /** Memoized generation function to prevent unnecessary recalculations */
  const handleGenerate = useCallback(() => {
    setPassword(generatePassword(length, options));
    setCopied(false);
  }, [length, options]);

  React.useEffect(() => { handleGenerate(); }, [handleGenerate]);

  /** * Entropy Calculation: Recalculates only when the password string changes.
   * This provides the raw data for the strength meter.
   */
  const entropy = useMemo(() => calculateEntropyFromPassword(password), [password]);

  // Visual logic for the strength meter
  const strengthFraction = Math.min(entropy / maxEntropy, 1);
  const barWidthPercent = `${Math.round(strengthFraction * 100)}%`;
  const hue = Math.round(strengthFraction * 120); // 0 (red) to 120 (green)
  const barColor = `hsl(${hue}, 85%, 47%)`;
  const barColorAlt = `hsl(${Math.min(120, hue + 12)}, 85%, 37%)`;
  const textColor = `hsl(${hue}, 85%, 70%)`;

  /** Custom CSS injection for the range slider thumb to match the theme */
  const sliderStyles = `
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(to right, rgb(${primaryColorRGB}), rgb(${accentColorRGB}));
      cursor: pointer;
      box-shadow: 0 0 10px rgba(${primaryColorRGB}, 0.8);
      transition: all 0.2s ease-in-out;
    }
    input[type='range']::-webkit-slider-runnable-track {
      width: 100%;
      height: 8px;
      cursor: pointer;
      background: rgba(${primaryColorRGB}, 0.3);
      border-radius: 4px;
    }
  `;

  /** Sub-component */
  const Checkbox = ({ id, label, checked, onChange }) => (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 cursor-pointer" onClick={onChange}>
      <div className={`relative w-5 h-5 rounded-md border-2 flex items-center justify-center ${checked ? 'border-transparent bg-gradient-to-r from-primary to-accent shadow-[0_0_15px_rgba(184,107,255,0.4)]' : 'border-primary/50 bg-dark'}`}>
        {checked && <Check className="w-4 h-4 text-white" />}
      </div>
      <label htmlFor={id} className="text-white text-sm select-none">{label}</label>
    </div>
  );

  return (
    <Layout>
      <style>{sliderStyles}</style>
      <div className="font-sans sm:p-8 pb-10">
        <div className="max-w-3xl mx-auto">

          <header className="text-center mb-10">
            <div className="bg-primary/10 w-fit mx-auto p-5 rounded-full shadow-[0_0_40px_rgba(199,94,255,0.25)] mb-4">
              <Zap className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-wider">PASSWORD GENERATOR</h1>
            <p className="mt-2 text-primary/90 text-sm">Create a strong cryptographic password.</p>
          </header>

          <div className="bg-light backdrop-blur-xl border border-primary/30 rounded-2xl p-8 shadow-xl hover:shadow-[0_0_100px_rgba(199,94,255,0.2)] transition duration-500">
            
            {/* DISPLAY SECTION */}
            <div className="flex items-center mb-8">
              <input
                type="text"
                value={password}
                readOnly // Password is generated, direct editing is disabled to keep entropy accurate
                className="flex-grow rounded-l-xl font-mono text-xl bg-dark/60 border border-primary/50 p-4 text-accent shadow-inner"
              />

              <button
                onClick={() => { 
                  navigator.clipboard.writeText(password); 
                  setCopied(true); 
                  setTimeout(() => setCopied(false), 2000); 
                }}
                className={`p-4 rounded-r-xl border border-l-0 transition-all duration-300 ${
                  copied
                    ? 'bg-gradient-to-r from-green-500 to-lime-400 border-green-500 shadow-[0_0_20px_rgba(0,255,120,0.6)]'
                    : 'bg-gradient-to-r from-primary to-accent border-primary/60 shadow-[0_0_15px_rgba(184,107,255,0.4)] hover:shadow-[0_0_25px_rgba(199,94,255,0.7)]'
                } text-white font-bold flex items-center justify-center w-24`}
              >
                {copied ? <Check className="w-6 h-6" /> : <Clipboard className="w-6 h-6" />}
              </button>
            </div>

            {/* STRENGTH METER */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-semibold">Password Strength:</p>
                <p className="font-mono text-sm" style={{ color: textColor }}>{entropy.toFixed(1)} bits</p>
              </div>
              <div className="h-2 bg-dark rounded-full overflow-hidden border border-primary/30">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: barWidthPercent, background: `linear-gradient(90deg, ${barColor}, ${barColorAlt})` }}
                />
              </div>
            </div>

            {/* CONTROLS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Length Slider */}
              <div className="bg-dark/60 border border-primary/40 rounded-xl p-5 shadow-inner">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-primary/30 pb-2 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary" /> Length: {length} characters
                </h3>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={length}
                  onChange={(e) => {
                    const newLength = Number(e.target.value);
                    setLength(newLength);
                  }}
                  className="w-full h-2 appearance-none cursor-pointer bg-transparent"
                />
              </div>

              {/* Character Set Toggles */}
              <div className="bg-dark/60 border border-primary/40 rounded-xl p-5 shadow-inner">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-primary/30 pb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-accent" /> Character Sets
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.keys(options).map((key) => (
                    <Checkbox
                      key={key}
                      id={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      checked={options[key]}
                      onChange={() => {
                        const newOptions = { ...options, [key]: !options[key] };
                        // Prevent unchecking all boxes
                        if (!Object.values(newOptions).some(v => v)) return;
                        setOptions(newOptions);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleGenerate}
              className="mt-10 w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 rounded-xl shadow-[0_0_40px_rgba(199,94,255,0.4)] hover:shadow-[0_0_60px_rgba(199,94,255,0.6)] transform hover:scale-[1.01] transition duration-300 flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-5 h-5" /> GENERATE NEW PASSWORD
            </button>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordGenerator;