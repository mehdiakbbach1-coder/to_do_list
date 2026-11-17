<script setup>
import TodoItem from './TodoItem.vue'

defineProps({
  todos: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle', 'rename', 'remove'])

function onToggle(id, completed) {
  emit('toggle', id, completed)
}

function onRename(id, title, done) {
  emit('rename', id, title, done)
}

function onRemove(id) {
  emit('remove', id)
}
</script>

<template>
  <ul class="todo-list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      :disabled="disabled"
      @toggle="onToggle"
      @rename="onRename"
      @remove="onRemove"
    />
  </ul>
</template>

<style scoped>
.todo-list {
  padding: 0;
  margin: 0;
}
</style>
