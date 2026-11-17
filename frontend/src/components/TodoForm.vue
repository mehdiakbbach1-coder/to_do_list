<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])
const title = ref('')
const validationMessage = ref('')

function submit() {
  const trimmed = title.value.trim()
  if (!trimmed) {
    validationMessage.value = 'Task title must not be empty or contain only whitespace.'
    return
  }
  validationMessage.value = ''
  emit('add', trimmed)
  title.value = ''
}

function clearValidation() {
  if (validationMessage.value) {
    validationMessage.value = ''
  }
}
</script>

<template>
  <form class="todo-form" @submit.prevent="submit">
    <label for="new-task" class="label">New task</label>
    <div class="row">
      <input
        id="new-task"
        v-model="title"
        type="text"
        class="input"
        placeholder="Enter a task title"
        @input="clearValidation"
      />
      <button type="submit" class="primary-button">Add task</button>
    </div>
    <p v-if="validationMessage" class="error">{{ validationMessage }}</p>
  </form>
</template>

<style scoped>
.todo-form {
  margin-bottom: 1rem;
}

.label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.row {
  display: flex;
  gap: 0.5rem;
}

.input {
  flex: 1;
  padding: 0.6rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
}

.primary-button {
  padding: 0.6rem 0.9rem;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}

.primary-button:hover {
  background: #1d4ed8;
}

.error {
  margin-top: 0.5rem;
  color: #b91c1c;
}
</style>
