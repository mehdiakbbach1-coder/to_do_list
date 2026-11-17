<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/stores/todoStore'
import TodoForm from '@/components/TodoForm.vue'
import TodoFilters from '@/components/TodoFilters.vue'
import TodoList from '@/components/TodoList.vue'

const todoStore = useTodoStore()
const { filteredTodos, todos, filter, isLoading, isSaving, loadError, actionError, activeCount, completedCount } =
  storeToRefs(todoStore)

onMounted(() => {
  todoStore.loadTodos()
})

async function handleAdd(title) {
  await todoStore.addTodo(title)
}

async function handleToggle(id, completed) {
  await todoStore.toggleTodo(id, completed)
}

async function handleRename(id, title, done) {
  const ok = await todoStore.renameTodo(id, title)
  if (typeof done === 'function') {
    done(ok)
  }
}

async function handleRemove(id) {
  await todoStore.removeTodo(id)
}
</script>

<template>
  <main class="app">
    <section class="card">
      <h1>To-Do Application</h1>
      <p class="subtitle">Manage your tasks in one list.</p>

      <TodoForm @add="handleAdd" />

      <div v-if="actionError" class="banner error" role="alert">
        <span>{{ actionError }}</span>
        <button type="button" class="link-button" @click="todoStore.clearActionError()">Dismiss</button>
      </div>

      <div v-if="loadError" class="banner error" role="alert">
        <p>{{ loadError }}</p>
        <button type="button" class="secondary-button" @click="todoStore.loadTodos()">Retry</button>
      </div>

      <p v-if="isLoading" class="status">Loading tasks...</p>

      <template v-if="!isLoading && !loadError">
        <TodoFilters v-model="filter" />

        <p class="counts">
          Total: {{ todos.length }} | Active: {{ activeCount }} | Completed: {{ completedCount }}
        </p>

        <p v-if="filteredTodos.length === 0" class="status">No tasks to show.</p>

        <TodoList
          v-else
          :todos="filteredTodos"
          :disabled="isSaving"
          @toggle="handleToggle"
          @rename="handleRename"
          @remove="handleRemove"
        />

        <p v-if="isSaving" class="status">Saving changes...</p>
      </template>
    </section>
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f1f5f9;
  color: #0f172a;
}

* {
  box-sizing: border-box;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.card {
  max-width: 760px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
}

h1 {
  margin: 0;
}

.subtitle {
  margin: 0.25rem 0 1rem;
  color: #475569;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.status {
  color: #475569;
}

.counts {
  margin: 0 0 0.75rem;
  color: #334155;
}

.link-button,
.secondary-button {
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 6px;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}
</style>
