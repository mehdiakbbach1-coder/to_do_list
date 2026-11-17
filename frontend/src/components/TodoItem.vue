<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle', 'rename', 'remove'])

const isEditing = ref(false)
const draftTitle = ref(props.todo.title)
const editError = ref('')

watch(
  () => props.todo.title,
  (newTitle) => {
    if (!isEditing.value) {
      draftTitle.value = newTitle
    }
  },
)

function onToggle(event) {
  emit('toggle', props.todo.id, event.target.checked)
}

function startEdit() {
  draftTitle.value = props.todo.title
  editError.value = ''
  isEditing.value = true
}

function cancelEdit() {
  draftTitle.value = props.todo.title
  editError.value = ''
  isEditing.value = false
}

async function saveEdit() {
  const trimmed = draftTitle.value.trim()
  if (!trimmed) {
    editError.value = 'Task title must not be empty or contain only whitespace.'
    return
  }
  const ok = await emitResult('rename', props.todo.id, trimmed)
  if (ok) {
    isEditing.value = false
    editError.value = ''
  }
}

function emitResult(eventName, ...args) {
  return new Promise((resolve) => {
    emit(eventName, ...args, resolve)
  })
}

function onRemove() {
  emit('remove', props.todo.id)
}
</script>

<template>
  <li class="todo-item">
    <div class="main">
      <label class="checkbox-label">
        <input
          type="checkbox"
          :checked="todo.completed"
          :disabled="disabled"
          @change="onToggle"
        />
        <span class="visually-hidden">Mark task as completed</span>
      </label>

      <div class="content">
        <template v-if="!isEditing">
          <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
        </template>
        <template v-else>
          <input v-model="draftTitle" type="text" class="edit-input" :disabled="disabled" />
        </template>
      </div>

      <div class="actions">
        <template v-if="!isEditing">
          <button type="button" class="secondary-button" :disabled="disabled" @click="startEdit">
            Rename
          </button>
          <button type="button" class="danger-button" :disabled="disabled" @click="onRemove">
            Delete
          </button>
        </template>
        <template v-else>
          <button type="button" class="primary-button" :disabled="disabled" @click="saveEdit">
            Save
          </button>
          <button type="button" class="secondary-button" :disabled="disabled" @click="cancelEdit">
            Cancel
          </button>
        </template>
      </div>
    </div>
    <p v-if="editError" class="error">{{ editError }}</p>
  </li>
</template>

<style scoped>
.todo-item {
  list-style: none;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  background: #fff;
}

.main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.content {
  flex: 1;
}

.completed {
  text-decoration: line-through;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 0.4rem;
}

.edit-input {
  width: 100%;
  padding: 0.45rem 0.55rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

.primary-button,
.secondary-button,
.danger-button {
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  font-size: 0.9rem;
}

.primary-button {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.secondary-button {
  background: #f8fafc;
}

.danger-button {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
}

.error {
  margin-top: 0.5rem;
  color: #b91c1c;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
