export default function Card({ children, className = '', title, actions, noPadding = false }) {
  return (
    <div className={`bg-th-srf border border-th-brd rounded-xl shadow-sm shadow-black/5 dark:shadow-black/30 transition-all duration-150 hover:border-th-brd hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-th-brds">
          {title && <h4 className="text-th-txt font-semibold text-sm">{title}</h4>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  )
}
