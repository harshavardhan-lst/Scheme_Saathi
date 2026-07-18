export default function GovCard({ children, className = '', interactive = false, onClick, as: Tag = 'div', ...props }) {
  const baseClass = interactive ? 'gov-card-interactive' : 'gov-card'
  return (
    <Tag className={`${baseClass} ${className}`} onClick={onClick} {...props}>
      {children}
    </Tag>
  )
}
