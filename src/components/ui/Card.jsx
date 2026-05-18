export default function Card({ children, className = '', title, actions, noPadding = false }) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl shadow-sm shadow-black/20 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          {title && <h2 className="text-slate-100 font-semibold text-sm">{title}</h2>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  )
}
