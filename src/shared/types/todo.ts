export interface TodoAppAction {
  id: number
  title: string
  description: string
  category: string
}

export interface TodoRealLifeAction {
  id: number
  title: string
  description: string
  category: string
  dustConditions: string[]
}

export interface TodoListData {
  appActions: TodoAppAction[]
  realLifeActions: TodoRealLifeAction[]
}

export interface UserTodo {
  id: number
  title: string
  completed: boolean
  createdAt: string
  completedAt?: string
}

