import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pages/Home.css'
import './pages/SubscriptionPage.css'
import './components/SubscriptionList.css'
import './components/NewSubscriptionForm.css'
import './components/SubscriptionCard.css'
import './components/SubscriptionDetail.css'
import './components/VisitTimeline.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
