export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-sm', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-base', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-lg', sub: 'text-xs' },
  }

  const s = sizes[size] || sizes.md

  // If only the icon is shown (CTA section), use blue icon on white background.
  // Otherwise use white icon on blue background.
  const iconColor = showText ? 'text-white' : 'text-primary-600'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${s.icon} rounded-card bg-primary-600 flex items-center justify-center shrink-0 shadow-card`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 40 40"
          className={`w-[70%] h-[70%] ${iconColor}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 28V12C10 10.5 11.2 9.5 12.5 9.5C13.8 9.5 15 10.5 15 12V26C15 27 15.8 27.8 17 27.8C18.2 27.8 19 27 19 26V14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 28C22 26.5 23.2 25.5 24.5 25.5C25.8 25.5 27 26.5 27 28V30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="24.5"
            cy="22"
            r="3.5"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold text-gov-text ${s.text} tracking-tight leading-none`}
          >
            SchemeSathi
          </span>
          <span
            className={`${s.sub} text-primary-600 font-semibold tracking-wide uppercase mt-0.5`}
          >
            AI Assistant
          </span>
        </div>
      )}
    </div>
  )
}