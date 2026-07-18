export default function SectionHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-desc mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}
