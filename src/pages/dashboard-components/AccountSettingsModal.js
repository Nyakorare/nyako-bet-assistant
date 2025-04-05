import { useState } from "react";
import { FiX, FiTrash2, FiAlertTriangle } from "react-icons/fi";
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
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

  const requestAccountDeletion = async () => {
    if (!deleteReason) {
      setError("Please provide a reason for deletion");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Store deletion request in database
      const { error } = await supabase
        .from('deletion_requests')
        .insert([{
          user_id: user.id,
          email: user.email,
          username: user.user_metadata?.username,
          reason: deleteReason,
          requested_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Sign out user
      await signOut();
      setSuccess("Deletion request submitted. You will be signed out.");
      setTimeout(() => onClose(), 2000);
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
        
        {showDeleteConfirmation ? (
          <div className="space-y-4">
            <div className={`flex items-start gap-3 p-4 rounded-lg ${
              darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
            }`}>
              <FiAlertTriangle className="mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Request Account Deletion</h3>
                <p className="text-sm">
                  This will submit a request to permanently delete your account and all associated data.
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div>
              <label className={`block mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Reason for deletion (optional)
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                }`}
                rows={3}
                placeholder="Help us improve by sharing your reason..."
              />
            </div>
            
            {error && (
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800'
              }`}>
                {error}
              </div>
            )}
            
            {success && (
              <div className={`p-3 rounded-lg ${
                darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800'
              }`}>
                {success}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={() => setShowDeleteConfirmation(false)}
                variant="outline"
                className="flex-1"
                darkMode={darkMode}
              >
                Cancel
              </Button>
              <Button
                onClick={requestAccountDeletion}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={loading}
                darkMode={darkMode}
              >
                {loading ? "Submitting..." : "Request Deletion"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className={`block mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Email</label>
                <input
                  type="email"
                  value={user?.email}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                  } cursor-not-allowed`}
                  disabled
                />
              </div>
              
              <div className="mb-4">
                <label className={`block mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  }`}
                  minLength={4}
                />
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
                disabled={loading}
                darkMode={darkMode}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
            
            <div className="border-t pt-4">
              <Button
                onClick={() => setShowDeleteConfirmation(true)}
                variant="outline"
                className="w-full text-red-600 border-red-600 hover:bg-red-600/10"
                darkMode={darkMode}
              >
                <FiTrash2 className="mr-2" />
                Request Account Deletion
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}