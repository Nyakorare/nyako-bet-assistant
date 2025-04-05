import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Modal from '../ui/modal';

export default function AuthModal({ darkMode, isOpen, onClose }) {
  const [isSignIn, setIsSignIn] = useState(true);

  const handleAuthSuccess = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
      {isSignIn ? (
        <SignIn 
          darkMode={darkMode} 
          onSuccess={handleAuthSuccess} 
          onSwitchToSignUp={() => setIsSignIn(false)} 
        />
      ) : (
        <SignUp 
          darkMode={darkMode} 
          onSuccess={handleAuthSuccess} 
          onSwitchToSignIn={() => setIsSignIn(true)} 
        />
      )}
    </Modal>
  );
}