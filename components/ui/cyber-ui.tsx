// Componentes UI reutilizables con estilo futurista cyberpunk
import { ReactNode } from 'react'
import Link from 'next/link'

// ============================================
// BOTONES
// ============================================

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export function CyberButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white',
    secondary: 'bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-300',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white',
    success: 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-medium rounded-full
        transform transition-all duration-300
        hover:scale-105 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" />
    </button>
  )
}

// ============================================
// CARDS
// ============================================

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export function CyberCard({ children, className = '', hover = true, gradient = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        ${gradient 
          ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/50' 
          : 'bg-gray-900/50'
        }
        backdrop-blur-xl
        border border-gray-700/50
        ${hover ? 'hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// ============================================
// INPUTS
// ============================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export function CyberInput({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full
            ${icon ? 'pl-10' : 'pl-4'}
            pr-4 py-3
            bg-gray-800/50
            border border-gray-700/50
            rounded-lg
            text-white
            placeholder-gray-500
            focus:outline-none
            focus:border-cyan-500/50
            focus:ring-2
            focus:ring-cyan-500/20
            transition-all duration-200
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  )
}

// ============================================
// BADGE
// ============================================

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

export function CyberBadge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  }

  return (
    <span
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-medium rounded-full
        border
        inline-flex items-center
      `}
    >
      {children}
    </span>
  )
}

// ============================================
// LOADING SPINNER
// ============================================

export function CyberLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full animate-spin">
          <div className="absolute inset-1 bg-black rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// MODAL
// ============================================

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function CyberModal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md mx-4">
        <CyberCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          {children}
        </CyberCard>
      </div>
    </div>
  )
}

// ============================================
// TABLE
// ============================================

interface TableProps {
  headers: string[]
  children: ReactNode
}

export function CyberTable({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            {headers.map((header, index) => (
              <th key={index} className="text-left py-3 px-4 text-gray-300 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  )
}

// ============================================
// ALERT
// ============================================

interface AlertProps {
  children: ReactNode
  variant?: 'info' | 'success' | 'warning' | 'danger'
  onClose?: () => void
}

export function CyberAlert({ children, variant = 'info', onClose }: AlertProps) {
  const variants = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400'
  }

  return (
    <div className={`
      ${variants[variant]}
      border rounded-lg p-4
      flex items-center justify-between
    `}>
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  )
}

// ============================================
// NAVIGATION LINK
// ============================================

interface NavLinkProps {
  href: string
  children: ReactNode
  icon?: ReactNode
  active?: boolean
}

export function CyberNavLink({ href, children, icon, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg
        transition-all duration-200
        ${active 
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }
      `}
    >
      {icon}
      {children}
    </Link>
  )
}

// ============================================
// SECTION HEADER
// ============================================

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function CyberSectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && (
          <p className="text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
} 