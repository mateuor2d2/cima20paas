export default defineNuxtRouteMiddleware((to) => {
  // Only protect /admin routes (but not /admin/login)
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  // Check if authenticated via cookie
  const isAuthenticated = useCookie('admin-auth').value === 'true'

  if (!isAuthenticated) {
    return navigateTo('/admin/login')
  }
})
