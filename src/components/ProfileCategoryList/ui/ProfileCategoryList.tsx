import type { ProfileCategoryListProps } from '../model/types'

export const ProfileCategoryList = ({ categories, selectedOptions, onCategoryClick }: ProfileCategoryListProps) => {
  return (
    <div className="profile-categories-mobile">
      {categories.map((category) => {
        const selectedOption = category.options.find(opt => opt.value === selectedOptions[category.category])
        return (
          <div key={category.category} className="category-item-mobile">
            <button 
              className="category-header-mobile"
              onClick={() => onCategoryClick(category)}
            >
              <div className="category-header-left">
                <h3 className="category-title-mobile">{category.category}</h3>
                {selectedOption && (
                  <span className="category-selected-mobile">{selectedOption.label}</span>
                )}
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}

