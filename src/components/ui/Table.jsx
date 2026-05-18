export function Table({ children, className = '' }) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm shadow-black/20 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
    </div>
  )
}

export function Thead({ children }) {
  return (
    <thead>
      <tr className="border-b border-slate-700">{children}</tr>
    </thead>
  )
}

export function Th({ children, className = '', ...props }) {
  return (
    <th className={`text-left text-slate-500 text-xs font-medium px-5 py-3 ${className}`} {...props}>
      {children}
    </th>
  )
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>
}

export function Tr({ children, className = '', ...props }) {
  return (
    <tr className={`border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  )
}

export function Td({ children, className = '', ...props }) {
  return (
    <td className={`px-5 py-3 ${className}`} {...props}>{children}</td>
  )
}
