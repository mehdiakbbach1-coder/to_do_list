<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

const current = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="filters" role="group" aria-label="Task filters">
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      class="filter-button"
      :class="{ active: current === filter.value }"
      @click="current = filter.value"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.filter-button {
  padding: 0.4rem 0.8rem;
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.filter-button.active {
  background: #e0e7ff;
  border-color: #6366f1;
  color: #312e81;
}
</style>
