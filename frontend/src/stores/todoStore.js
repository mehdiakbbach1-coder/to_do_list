import { defineStore } from 'pinia'
import { createTodo, deleteTodo, fetchTodos, updateTodo } from '@/api/todos'

export const useTodoStore = defineStore('todos', {
  state: () => ({
    todos: [],
    filter: 'all',
    isLoading: false,
    isSaving: false,
    loadError: '',
    actionError: '',
    lastSuccessfulTodos: [],
  }),
  getters: {
    filteredTodos(state) {
      if (state.filter === 'active') {
        return state.todos.filter((todo) => !todo.completed)
      }
      if (state.filter === 'completed') {
        return state.todos.filter((todo) => todo.completed)
      }
      return state.todos
    },
    activeCount(state) {
      return state.todos.filter((todo) => !todo.completed).length
    },
    completedCount(state) {
      return state.todos.filter((todo) => todo.completed).length
    },
  },
  actions: {
    setFilter(filter) {
      this.filter = filter
    },
    clearActionError() {
      this.actionError = ''
    },
    snapshotSuccess() {
      this.lastSuccessfulTodos = this.todos.map((todo) => ({ ...todo }))
    },
    restoreLastSuccessful() {
      this.todos = this.lastSuccessfulTodos.map((todo) => ({ ...todo }))
    },
    async loadTodos() {
      this.isLoading = true
      this.loadError = ''
      try {
        const todos = await fetchTodos()
        this.todos = todos
        this.snapshotSuccess()
      } catch (error) {
        this.loadError = error.message || 'Failed to load tasks.'
      } finally {
        this.isLoading = false
      }
    },
    async addTodo(title) {
      const trimmedTitle = typeof title === 'string' ? title.trim() : ''
      if (!trimmedTitle) {
        this.actionError = 'Task title must not be empty or contain only whitespace.'
        return false
      }

      this.isSaving = true
      this.actionError = ''
      try {
        const created = await createTodo(trimmedTitle)
        this.todos.push(created)
        this.snapshotSuccess()
        return true
      } catch (error) {
        this.actionError = error.message || 'Failed to save task.'
        this.restoreLastSuccessful()
        return false
      } finally {
        this.isSaving = false
      }
    },
    async renameTodo(id, title) {
      const trimmedTitle = typeof title === 'string' ? title.trim() : ''
      if (!trimmedTitle) {
        this.actionError = 'Task title must not be empty or contain only whitespace.'
        return false
      }

      this.isSaving = true
      this.actionError = ''
      try {
        const updated = await updateTodo(id, { title: trimmedTitle })
        const index = this.todos.findIndex((todo) => todo.id === id)
        if (index !== -1) {
          this.todos[index] = updated
        }
        this.snapshotSuccess()
        return true
      } catch (error) {
        this.actionError = error.message || 'Failed to save task.'
        this.restoreLastSuccessful()
        return false
      } finally {
        this.isSaving = false
      }
    },
    async toggleTodo(id, completed) {
      this.isSaving = true
      this.actionError = ''
      try {
        const updated = await updateTodo(id, { completed })
        const index = this.todos.findIndex((todo) => todo.id === id)
        if (index !== -1) {
          this.todos[index] = updated
        }
        this.snapshotSuccess()
        return true
      } catch (error) {
        this.actionError = error.message || 'Failed to save task.'
        this.restoreLastSuccessful()
        return false
      } finally {
        this.isSaving = false
      }
    },
    async removeTodo(id) {
      this.isSaving = true
      this.actionError = ''
      try {
        await deleteTodo(id)
        this.todos = this.todos.filter((todo) => todo.id !== id)
        this.snapshotSuccess()
        return true
      } catch (error) {
        this.actionError = error.message || 'Failed to save task.'
        this.restoreLastSuccessful()
        return false
      } finally {
        this.isSaving = false
      }
    },
  },
})
