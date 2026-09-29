import React from 'react';
import { Check, X } from 'lucide-react';

export const PasswordStrengthMeter = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { label: 'Number (0-9)', valid: /[0-9]/.test(password) },
    { label: 'Special char (!@#$%)', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;

  const getLabel = () => {
    if (password.length === 0) return { text: '', bgClass: 'bg-transparent', textClass: 'text-transparent', width: 'w-0' };
    if (score <= 2) return { text: 'Weak', bgClass: 'bg-rose-500', textClass: 'text-rose-500', width: 'w-1/4' };
    if (score === 3 || score === 4) return { text: 'Medium', bgClass: 'bg-amber-500', textClass: 'text-amber-500', width: 'w-2/3' };
    return { text: 'Strong', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500', width: 'w-full' };
  };

  const strength = getLabel();

  if (!password) return null;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 my-1 w-full max-w-[360px]">
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
        <div className={`h-full transition-all duration-300 ${strength.width} ${strength.bgClass}`} />
      </div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-slate-400 font-medium">Password Strength:</span>
        <span className={`font-bold ${strength.textClass}`}>{strength.text}</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] p-0 m-0 list-none">
        {checks.map((item, idx) => (
          <li key={idx} className={`flex items-center gap-1.5 ${item.valid ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
            {item.valid ? <Check size={13} className="shrink-0" /> : <X size={13} className="shrink-0" />}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
