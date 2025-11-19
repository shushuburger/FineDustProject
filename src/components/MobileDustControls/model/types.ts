export interface MobileDustControlsProps {
  isOpen: boolean
  testPm10: number | null
  onToggle: () => void
  onClose: () => void
  onTestPm10Change: (value: number | null) => void
}

