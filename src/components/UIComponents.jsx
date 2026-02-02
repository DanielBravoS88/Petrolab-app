// Componente de loading spinner
export function LoadingSpinner({ size = 'md', text = 'Cargando...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-petrolab-blue-200 border-t-petrolab-blue-600 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  )
}

// Badge de estado
export function EstadoBadge({ estado }) {
  const badgeClasses = {
    BORRADOR: 'badge-borrador',
    EN_REVISION: 'badge-revision',
    APROBADA: 'badge-aprobada',
    RECHAZADA: 'badge-rechazada'
  }

  return (
    <span className={`badge ${badgeClasses[estado] || 'badge-borrador'}`}>
      {estado}
    </span>
  )
}

// Componente de mensaje de alerta
export function Alert({ type = 'info', title, message, onClose }) {
  const types = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`border-l-4 p-4 rounded ${types[type]} fade-in`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icons[type]}</span>
          <div>
            {title && <h4 className="font-bold mb-1">{title}</h4>}
            {message && <p className="text-sm">{message}</p>}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-xl hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </div>
  )
}

// Componente de confirmación
export function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmar',
  confirmColor = 'bg-red-600 hover:bg-red-700',
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 fade-in">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className={`${confirmColor} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente de card
export function Card({ title, children, className = '' }) {
  return (
    <div className={`card-petrolab ${className}`}>
      {title && <h3 className="section-title">{title}</h3>}
      {children}
    </div>
  )
}

// Componente de input con label
export function FormField({ label, error, required, children }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="label-petrolab">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Botón con loading
export function Button({ children, loading, disabled, className = '', ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" text="" />
          <span>Procesando...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
