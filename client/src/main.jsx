import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import UnderMaintain from './UnderMaintain.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />

    {/* For showing the maintenance page uncomment this */}
    {/* <UnderMaintain /> */}

  </React.StrictMode>,
)
