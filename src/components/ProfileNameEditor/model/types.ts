export interface ProfileNameEditorProps {
  userName: string
  isEditing: boolean
  onUserNameChange: (name: string) => void
  onEditStart: () => void
  onEditEnd: () => void
  isMobile?: boolean
}

