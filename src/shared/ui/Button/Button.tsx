import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap'

  const variantClasses = {
    primary: disabled
      ? 'text-white opacity-50 cursor-not-allowed'
      : 'text-white hover:opacity-90 active:opacity-80',
    secondary: disabled
      ? 'border opacity-50 cursor-not-allowed'
      : 'border hover:opacity-90 active:opacity-80',
    danger: disabled
      ? 'text-white opacity-50 cursor-not-allowed'
      : 'text-white hover:opacity-90 active:opacity-80',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const getVariantStyles = () => {
    if (disabled) {
      switch (variant) {
        case 'primary':
          return { backgroundColor: '#8080FF' }
        case 'secondary':
          return {
            backgroundColor: '#FFFFFF',
            borderColor: '#E9EAEC',
            color: '#17191B',
          }
        case 'danger':
          return { backgroundColor: '#FF6C6C' }
        default:
          return { backgroundColor: '#8080FF' }
      }
    }

    switch (variant) {
      case 'primary':
        return { backgroundColor: '#8080FF' }
      case 'secondary':
        return {
          backgroundColor: '#FFFFFF',
          borderColor: '#E9EAEC',
          color: '#17191B',
        }
      case 'danger':
        return { backgroundColor: '#FF6C6C' }
      default:
        return { backgroundColor: '#8080FF' }
    }
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={getVariantStyles()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
