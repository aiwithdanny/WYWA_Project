import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200'

  const variants = {
    primary: 'bg-[#1A4A8A] hover:bg-[#0A1628] text-white hover:-translate-y-0.5 hover:shadow-lg',
    outline: 'border border-white/20 text-white hover:border-white/50 hover:bg-white/5',
    gold:    'bg-[#C8A84B] hover:bg-[#E8C96A] text-[#0A1628] hover:-translate-y-0.5 hover:shadow-lg',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {children}
    </button>
  )
}
