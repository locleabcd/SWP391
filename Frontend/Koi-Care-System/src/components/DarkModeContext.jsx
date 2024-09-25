import { createContext, useContext, useState, useEffect } from 'react'

const DarkModeContext = createContext()

// eslint-disable-next-line react/prop-types
export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or default to light mode
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode
      localStorage.setItem('darkMode', JSON.stringify(newMode))
      return newMode
    })
  }

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode'
  }, [isDarkMode])

  return <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>
}

export function useDarkMode() {
  return useContext(DarkModeContext)
}
