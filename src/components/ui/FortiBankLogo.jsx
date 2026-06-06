export default function FortiBankLogo({ className = 'text-xl' }) {
  return (
    <span className={`inline-flex items-center font-extrabold tracking-tight select-none leading-none ${className}`}>
      <span className="text-[#0d1f3c] dark:text-slate-100">F</span>

      {/* Shield badge — replaces the 'o' */}
      <svg
        style={{ width: '0.78em', height: '0.78em', margin: '0 0.04em' }}
        viewBox="0 0 24 28"
        fill="none"
        aria-hidden="true"
      >
        {/* Shield body */}
        <path
          d="M12 1L2 5.8V13.5c0 6.2 4.3 11.9 10 13.5 5.7-1.6 10-7.3 10-13.5V5.8L12 1z"
          fill="#3b82f6"
        />
        {/* Circle badge */}
        <circle cx="12" cy="13" r="5.2" fill="white" fillOpacity="0.2" />
        {/* Star */}
        <polygon
          points="12,8.5 13.2,11.9 16.8,11.9 13.9,14 15,17.4 12,15.3 9,17.4 10.1,14 7.2,11.9 10.8,11.9"
          fill="white"
          fillOpacity="0.95"
        />
      </svg>

      <span className="text-[#0d1f3c] dark:text-slate-100">rti</span>
      <span className="text-blue-500">Bank</span>
    </span>
  )
}
