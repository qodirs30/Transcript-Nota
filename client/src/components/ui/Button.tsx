import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'motion/react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'ghost' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

const variants = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg shadow-primary-600/20 active:shadow-primary-600/10',
  success: 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:shadow-emerald-600/10',
  danger: 'bg-gradient-to-br from-danger-500 to-danger-600 hover:from-danger-400 hover:to-danger-500 text-white shadow-lg shadow-danger-600/20 active:shadow-danger-600/10',
  ghost: 'bg-surface-800/40 hover:bg-surface-700/50 text-surface-200 border border-surface-600/20 hover:border-primary-500/20',
  glow: 'bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30 animate-gradient hover:shadow-primary-500/40',
}

const sizes = {
  sm: 'px-4 py-2.5 text-sm rounded-xl min-h-[40px]',
  md: 'px-6 py-3 text-sm rounded-xl min-h-[46px]',
  lg: 'px-8 py-4 text-base rounded-2xl min-h-[54px]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        font-semibold transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        inline-flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
