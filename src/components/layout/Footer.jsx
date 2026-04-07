
export default function Footer() {
  return (
    <footer className="border-t border-slate-800 px-6 py-4 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} FortiBank. Cybersecurity Training Platform.
        </p>
        <p className="text-slate-700 text-xs">
          All training activity is monitored and recorded.
        </p>
      </div>
    </footer>
  )
}