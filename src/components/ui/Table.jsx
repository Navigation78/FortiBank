export function Table({ children, className = '' }) {
  return (
    <div className={`bg-th-srf border border-th-brd rounded-xl overflow-hidden shadow-sm shadow-black/5 dark:shadow-black/30 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
    </div>
  )
}

export function Thead({ children }) {
  return (
    <thead>
      <tr className="border-b border-th-brd">{children}</tr>
    </thead>
  )
}

export function Th({ children, className = '', ...props }) {
  return (
    <th className={`text-left text-th-muted text-xs font-medium px-5 py-3 ${className}`} {...props}>
      {children}
    </th>
  )
}

export function Tbody({ children }) {
  return <tbody>{children}</tbody>
}

export function Tr({ children, className = '', ...props }) {
  return (
    <tr className={`border-b border-th-brds last:border-0 hover:bg-th-hov transition-all duration-150 ${className}`} {...props}>
      {children}
    </tr>
  )
}

export function Td({ children, className = '', ...props }) {
  return (
    <td className={`px-5 py-3 text-th-txt text-sm ${className}`} {...props}>{children}</td>
  )
}
