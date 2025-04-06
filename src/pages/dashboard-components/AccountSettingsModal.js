import { useState, useEffect } from "react";
import { FiX, FiCheck, FiMail } from "react-icons/fi";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function AccountSettingsModal({ isOpen, onClose, darkMode }) {
  const { user, signOut } = useAuth();
  const [username, setUsername] = useState(user?.user_metadata?.username || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Check username availability
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username.length >= 3 && username !== user?.user_metadata?.username) {
        setCheckingUsername(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();
          
          setUsernameAvailable(!data);
        } catch (error) {
          setUsernameAvailable(false);
        } finally {
          setCheckingUsername(false);
        }
      }
    };

    const timer = setTimeout(() => {
      checkUsernameAvailability();
    }, 500);

    return () => clearTimeout(timer);
  }, [username, user?.user_metadata?.username]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check username availability one more time before saving
      if (username !== user?.user_metadata?.username) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();
        
        if (data) {
          throw new Error('Username is already taken');
        }
      }

      // Update username if changed
      if (username !== user?.user_metadata?.username) {
        const { error } = await supabase.auth.updateUser({
          data: { username }
        });
        if (error) throw error;
      }

      // Update password if provided
      if (password) {
        const { error } = await supabase.auth.updateUser({
          password
        });
        if (error) throw error;
      }

      setSuccess("Account updated successfully");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            Account Settings
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>
        
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Email</label>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
            }`}>
              <FiMail className={darkMode ? "text-gray-400" : "text-gray-500"} />
              <span>{user?.email}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                } ${username.length > 0 && !usernameAvailable ? 'border-red-500' : ''}`}
                minLength={4}
                required
              />
              {checkingUsername && (
                <div className="absolute right-3 top-3.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                </div>
              )}
              {!checkingUsername && username.length >= 3 && (
                <div className="absolute right-3 top-3.5">
                  {usernameAvailable ? (
                    <FiCheck className={darkMode ? "text-green-400" : "text-green-600"} />
                  ) : (
                    <span className="text-xs text-red-500">Taken</span>
                  )}
                </div>
              )}
            </div>
            <p className={`text-xs mt-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Minimum 4 characters. Usernames must be unique.
            </p>
          </div>
          
          <div className="mb-6">
            <label className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
              placeholder="Leave blank to keep current password"
            />
          </div>
          
          {error && (
            <div className={`mb-4 p-3 rounded-lg ${
              darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800'
            }`}>
              {error}
            </div>
          )}
          
          {success && (
            <div className={`mb-4 p-3 rounded-lg ${
              darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800'
            }`}>
              {success}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full mb-4"
            disabled={loading || (username.length > 0 && !usernameAvailable)}
            darkMode={darkMode}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
        
        <div className="border-t pt-4">
          <Button
            onClick={signOut}
            variant="outline"
            className="w-full"
            darkMode={darkMode}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </Modal>
  );
}