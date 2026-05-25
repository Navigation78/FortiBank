
export default function Footer() {
  return (
    <footer className="border-t border-th-brd px-6 py-4 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-th-muted text-xs">
          © {new Date().getFullYear()} FortiBank. Cybersecurity Training Platform.
        </p>
        <p className="text-th-muted text-xs">
          All training activity is monitored and recorded.
        </p>
      </div>
    </footer>
  )
}
