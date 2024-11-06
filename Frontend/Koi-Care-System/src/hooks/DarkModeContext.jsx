import { createContext, useContext, useState, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
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

  // Define light and dark themes
  const lightTheme = createTheme({
    palette: {
      mode: 'light'
    }
  })

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: 'rgb(36 48 63 / var(--tw-bg-opacity))',
        paper: 'rgb(36 48 63 / var(--tw-bg-opacity))'
      }
    }
  })

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>
    </ThemeProvider>
  )
}

export function useDarkMode() {
  return useContext(DarkModeContext)
}
