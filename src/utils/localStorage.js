// Save data to localStorage
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage', error)
  }
}

// Get data from localStorage
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage', error)
    return defaultValue
  }
}

// Remove item
export const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}

// Clear all localStorage
export const clearLocalStorage = () => {
  localStorage.clear()
}
