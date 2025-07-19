export async function getAdminCredentials() {
  const response = await fetch('/api/admin/credentials', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.json()
}

export async function verifyLogin(username: string, password: string) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  return response.json()
}
