export const colors = {
  brand: {
    primary: '#0e74be',
    primarySoft: '#0b63a5',
    accent: '#36a9e1'
  },
  background: {
    base: '#f3f4f6',
    surface: '#ffffff',
    surfaceAlt: '#e5e7eb'
  },
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    muted: '#6b7280'
  },
  border: {
    subtle: '#e5e7eb'
  },
  status: {
    success: '#22c55e',
    warning: '#facc15',
    danger: '#ef4444',
    info: '#0ea5e9'
  }
} as const;

export const radii = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem'
} as const;

export const shadows = {
  card: '0 10px 30px rgba(15,23,42,0.25)'
} as const;
