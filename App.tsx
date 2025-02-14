import { AuthProvider } from './contexts/AuthContext'
import { PaperProvider } from 'react-native-paper'

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        {/* Your existing app content */}
      </AuthProvider>
    </PaperProvider>
  )
} 