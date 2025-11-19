import type { ProfileCategoryCardProps } from '../model/types'

export const ProfileCategoryCard = ({ category, selectedValue, onSelect }: ProfileCategoryCardProps) => {
  return (
    <div className="profile-category-card">
      <h3 className="category-title">{category.category}</h3>
      <div className="category-options">
        {category.options.map((option) => {
          const isSelected = selectedValue === option.value
          return (
            <button
              key={option.value}
              className={`option-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(option.value)}
              title={option.recommendation}
            >
              {option.label}
              {option.recommendation && <span className="recommendation-text">{option.recommendation}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

