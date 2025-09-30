import React from 'react'
import { RouterProvider } from 'react-router'

import ErrorBoundary from '@/app/providers/ErrorBoundary'
import router from '@/app/providers/router'

const App: React.FC = () => (
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
)
App.displayName = 'App'
export default App
