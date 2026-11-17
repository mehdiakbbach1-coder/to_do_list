const API_BASE_URL = '/api/todos'

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const message = data && data.error ? data.error : 'Request failed. Please try again.'
    throw new Error(message)
  }

  return data
}

export async function fetchTodos() {
  const response = await fetch(API_BASE_URL)
  return parseResponse(response)
}

export async function createTodo(title) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  return parseResponse(response)
}

export async function updateTodo(id, updates) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  return parseResponse(response)
}

export async function deleteTodo(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return parseResponse(response)
}
