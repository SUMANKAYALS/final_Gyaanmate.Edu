import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export const Input = forwardRef(({ className = '', error, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
        />
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-2.5 rounded-xl
          bg-slate-800/60 border border-slate-600/60
          text-white placeholder:text-slate-500
          focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20
          transition-all duration-200
          ${Icon ? 'pl-10' : ''}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export const TextArea = forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`
        w-full px-4 py-3 rounded-xl
        bg-slate-800/60 border border-slate-600/60
        text-white placeholder:text-slate-500
        focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20
        transition-all duration-200 resize-none
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
        ${className}
      `}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';
