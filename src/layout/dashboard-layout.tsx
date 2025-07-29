export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex grow flex-col">
      <header className="p-4">
        <h1 className="font-bit text-xl">Dashboard</h1>
      </header>
      <main className="p-4">{children}</main>
      <footer className="bg-gray-800 p-4 text-center text-white">
        © 2023 Your Company
      </footer>
    </div>
  )
}
