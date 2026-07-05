export default function CategoryBadge({ category }) {
  if (!category) return null
  return (
    <span
      className="category-badge"
      style={{
        background: category.color + '22',
        color: category.color,
        border: `1px solid ${category.color}44`,
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: category.color, display: 'inline-block',
      }} />
      {category.name}
    </span>
  )
}
