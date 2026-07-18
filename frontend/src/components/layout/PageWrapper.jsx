export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={`page-section animate-fade-in ${className}`}>
      {children}
    </main>
  )
}
