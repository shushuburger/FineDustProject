import { useState, useEffect } from 'react'

export const useProfileCategoryModal = (isOpen: boolean, initialSelectedValue: string) => {
  const [tempSelected, setTempSelected] = useState(initialSelectedValue)

  useEffect(() => {
    if (isOpen) {
      setTempSelected(initialSelectedValue)
    }
  }, [isOpen, initialSelectedValue])

  return { tempSelected, setTempSelected }
}

