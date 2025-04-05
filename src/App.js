// App.js
import { AuthProvider } from './context/AuthContext';
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Dashboard />
      </div>
    </AuthProvider>
  );
}

export default App;