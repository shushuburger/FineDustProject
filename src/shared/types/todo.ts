export interface TodoRealLifeAction {
  id: number
  title: string
  description: string
  category: string
  guidelineKey?: string
  dustConditions: string[]
}

export interface TodoListData {
  realLifeActions: TodoRealLifeAction[]
}

export interface UserTodo {
  id: number
  title: string
  completed: boolean
  createdAt: string
  completedAt?: string
}

