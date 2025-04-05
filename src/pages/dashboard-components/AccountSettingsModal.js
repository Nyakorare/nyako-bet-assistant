import { FiX } from "react-icons/fi";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";

export default function AccountSettingsModal({ isOpen, onClose, darkMode }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            Account Settings
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
            <input
              type="text"
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700 focus:border-emerald-500' : 
                'bg-white border-gray-300 focus:border-emerald-400'
              } focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
              }`}
              placeholder="Enter new username"
            />
          </div>
          
          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700 focus:border-emerald-500' : 
                'bg-white border-gray-300 focus:border-emerald-400'
              } focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
              }`}
              placeholder="Enter new email"
            />
          </div>
          
          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700 focus:border-emerald-500' : 
                'bg-white border-gray-300 focus:border-emerald-400'
              } focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
              }`}
              placeholder="Enter new password"
            />
          </div>
          
          <Button
            onClick={onClose}
            className="w-full mt-6"
            darkMode={darkMode}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}