export default function DashboardFooter({ darkMode }) {
    return (
      <footer className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'} text-center p-4 text-sm border-t transition-opacity duration-300`}>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>&copy; 2025 Nyakorare. All Rights Reserved.</p>
        <p className="mt-2">
          <a href="#" className={`${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'} transition-colors duration-300 underline`}>
            Privacy Policy
          </a> 
          <span className={`mx-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
          <a href="#" className={`${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'} transition-colors duration-300 underline`}>
            Terms of Service
          </a>
        </p>
      </footer>
    );
  }