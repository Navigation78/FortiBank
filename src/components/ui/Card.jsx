export default function Card({ children, className = '', title, actions, noPadding = false }) {
  return (
    <div className={`bg-slate-800 border border-white/[0.08] rounded-xl shadow-sm shadow-black/30 transition-all duration-150 hover:border-white/[0.14] hover:shadow-md hover:shadow-black/40 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          {title && <h4 className="text-slate-100 font-semibold text-sm">{title}</h4>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  )
}
