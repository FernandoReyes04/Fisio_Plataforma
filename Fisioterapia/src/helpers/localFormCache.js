const CACHE_PREFIX = 'fisiolabs:form-cache:'
const CACHE_META_PREFIX = 'fisiolabs:form-cache-meta:'

const cacheableSelector = 'input, textarea, select'
const RESTORE_ATTEMPTS = 12
const RESTORE_INTERVAL_MS = 200
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7

const getUserStorageKey = () => import.meta.env.VITE_USUARIO

const getCurrentUserScope = () => {
  const userStorageKey = getUserStorageKey()
  const username = userStorageKey ? localStorage.getItem(userStorageKey) : null
  return username || 'anon'
}

const shouldSkipElement = (el) => {
  if (!el) return true
  if (el.disabled) return true
  if (el.type === 'password' || el.type === 'file') return true
  return false
}

const buildDomPath = (el) => {
  const parts = []
  let current = el
  let depth = 0

  while (current && current !== document.body && depth < 8) {
    const tag = (current.tagName || '').toLowerCase()
    if (!tag) break

    const id = current.id ? `#${current.id}` : ''
    if (id) {
      parts.unshift(`${tag}${id}`)
      break
    }

    const parent = current.parentElement
    if (!parent) {
      parts.unshift(tag)
      break
    }

    const siblings = Array.from(parent.children).filter((node) => node.tagName === current.tagName)
    const siblingIndex = siblings.indexOf(current) + 1
    parts.unshift(`${tag}:nth-of-type(${siblingIndex})`)

    current = parent
    depth += 1
  }

  return parts.join('>')
}

const getElementKey = (el) => {
  const tag = el.tagName.toLowerCase()
  const type = (el.type || '').toLowerCase()
  const id = el.id || ''
  const name = el.name || ''
  const placeholder = el.placeholder || ''
  const dataKey = el.getAttribute('data-cache-key') || ''
  const domPath = buildDomPath(el)

  if (dataKey) return `data:${dataKey}`
  if (id) return `id:${tag}|${type}|${id}`
  if (name) return `name:${tag}|${type}|${name}|${domPath}`
  return `path:${tag}|${type}|${placeholder}|${domPath}`
}

const buildRouteKey = (routeFullPath, userScope = getCurrentUserScope()) => `${CACHE_PREFIX}${userScope}:${routeFullPath}`
const buildMetaKey = (routeFullPath, userScope = getCurrentUserScope()) => `${CACHE_META_PREFIX}${userScope}:${routeFullPath}`

const isExpired = (updatedAt) => {
  if (!updatedAt) return false
  const timestamp = new Date(updatedAt).getTime()
  if (Number.isNaN(timestamp)) return false
  return Date.now() - timestamp > CACHE_TTL_MS
}

const removeCacheEntry = (routeFullPath, userScope = getCurrentUserScope()) => {
  localStorage.removeItem(buildRouteKey(routeFullPath, userScope))
  localStorage.removeItem(buildMetaKey(routeFullPath, userScope))
}

const pruneExpiredEntries = () => {
  const keysToDelete = []

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith(CACHE_META_PREFIX)) continue

    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed = JSON.parse(raw)
      if (!isExpired(parsed.updatedAt)) continue

      const dataKey = key.replace(CACHE_META_PREFIX, CACHE_PREFIX)
      keysToDelete.push(key, dataKey)
    } catch {
      const dataKey = key.replace(CACHE_META_PREFIX, CACHE_PREFIX)
      keysToDelete.push(key, dataKey)
    }
  }

  keysToDelete.forEach((key) => localStorage.removeItem(key))
}

const serializeFormState = () => {
  const elements = Array.from(document.querySelectorAll(cacheableSelector))
  const records = []

  elements.forEach((el) => {
    if (shouldSkipElement(el)) return

    const key = getElementKey(el)
    const type = (el.type || '').toLowerCase()
    const tag = el.tagName.toLowerCase()

    if (type === 'checkbox' || type === 'radio') {
      records.push({ key, type, checked: !!el.checked })
      return
    }

    if (tag === 'select' && el.multiple) {
      const selectedValues = Array.from(el.options)
        .filter(option => option.selected)
        .map(option => option.value)
      records.push({ key, type: 'select-multiple', value: selectedValues })
      return
    }

    records.push({ key, type, value: el.value ?? '' })
  })

  return records
}

const applyFormState = (records) => {
  if (!Array.isArray(records) || records.length === 0) return

  const elements = Array.from(document.querySelectorAll(cacheableSelector))
  const recordMap = new Map(records.map(r => [r.key, r]))

  elements.forEach((el) => {
    if (shouldSkipElement(el)) return

    const key = getElementKey(el)
    const record = recordMap.get(key)
    if (!record) return

    const type = (el.type || '').toLowerCase()
    const tag = el.tagName.toLowerCase()

    if (type === 'checkbox' || type === 'radio') {
      el.checked = !!record.checked
      el.dispatchEvent(new Event('change', { bubbles: true }))
      return
    }

    if (tag === 'select' && el.multiple && Array.isArray(record.value)) {
      Array.from(el.options).forEach((option) => {
        option.selected = record.value.includes(option.value)
      })
      el.dispatchEvent(new Event('change', { bubbles: true }))
      return
    }

    el.value = record.value ?? ''
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

export const initLocalFormCache = (router) => {
  pruneExpiredEntries()

  let currentRoutePath = router.currentRoute.value.fullPath
  let currentUserScope = getCurrentUserScope()
  let currentRouteKey = buildRouteKey(currentRoutePath, currentUserScope)
  let currentMetaKey = buildMetaKey(currentRoutePath, currentUserScope)
  let saveTimer = null
  let restoreTimer = null

  const saveCurrentRoute = () => {
    try {
      currentUserScope = getCurrentUserScope()
      currentRouteKey = buildRouteKey(currentRoutePath, currentUserScope)
      currentMetaKey = buildMetaKey(currentRoutePath, currentUserScope)

      const data = serializeFormState()
      const updatedAt = new Date().toISOString()

      localStorage.setItem(currentRouteKey, JSON.stringify({ updatedAt, records: data }))
      localStorage.setItem(currentMetaKey, JSON.stringify({ updatedAt }))
    } catch (error) {
      console.error('No se pudo guardar cache local del formulario', error)
    }
  }

  const scheduleSave = () => {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(saveCurrentRoute, 250)
  }

  const scheduleRestoreWithRetries = () => {
    if (restoreTimer) clearTimeout(restoreTimer)

    let attempt = 0
    const runRestore = () => {
      restoreCurrentRoute()
      attempt += 1
      if (attempt < RESTORE_ATTEMPTS) {
        restoreTimer = setTimeout(runRestore, RESTORE_INTERVAL_MS)
      }
    }

    runRestore()
  }

  const restoreCurrentRoute = () => {
    try {
      currentUserScope = getCurrentUserScope()
      currentRouteKey = buildRouteKey(currentRoutePath, currentUserScope)

      const raw = localStorage.getItem(currentRouteKey)
      if (!raw) return
      const parsed = JSON.parse(raw)

      if (isExpired(parsed.updatedAt)) {
        removeCacheEntry(currentRoutePath, currentUserScope)
        return
      }

      applyFormState(parsed.records)
    } catch (error) {
      console.error('No se pudo restaurar cache local del formulario', error)
    }
  }

  document.addEventListener('input', scheduleSave, true)
  document.addEventListener('change', scheduleSave, true)
  window.addEventListener('beforeunload', saveCurrentRoute)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      saveCurrentRoute()
    }
  })

  router.afterEach((to) => {
    saveCurrentRoute()
    currentRoutePath = to.fullPath
    currentUserScope = getCurrentUserScope()
    currentRouteKey = buildRouteKey(currentRoutePath, currentUserScope)
    currentMetaKey = buildMetaKey(currentRoutePath, currentUserScope)
    scheduleRestoreWithRetries()
  })

  scheduleRestoreWithRetries()
}

export const clearLocalFormCacheByRoute = (routeFullPath) => {
  if (!routeFullPath) return
  removeCacheEntry(routeFullPath, getCurrentUserScope())
}

export const clearAllLocalFormCacheForCurrentUser = () => {
  const userScope = getCurrentUserScope()
  const keysToDelete = []

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (!key) continue
    if (key.startsWith(`${CACHE_PREFIX}${userScope}:`) || key.startsWith(`${CACHE_META_PREFIX}${userScope}:`)) {
      keysToDelete.push(key)
    }
  }

  keysToDelete.forEach((key) => localStorage.removeItem(key))
}

export const clearAllLocalFormCache = () => {
  const keysToDelete = []

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (!key) continue
    if (key.startsWith(CACHE_PREFIX) || key.startsWith(CACHE_META_PREFIX)) {
      keysToDelete.push(key)
    }
  }

  keysToDelete.forEach((key) => localStorage.removeItem(key))
}
