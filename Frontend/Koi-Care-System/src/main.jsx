import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { store } from './redux/store/store'
import { registerLicense } from '@syncfusion/ej2-base'

registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1NpRmJGfV5ycEVHYlZTQHxaQU0SNHVRdkdnWH9ecXRVRGZcVkd2WEQ=')
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
