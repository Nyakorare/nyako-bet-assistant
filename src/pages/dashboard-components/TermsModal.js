import { FiX } from "react-icons/fi";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";

export default function TermsModal({ isOpen, onClose, darkMode }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            Terms & Privacy Policy
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
        
        <div className={`max-h-[70vh] overflow-y-auto p-4 rounded-lg ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          <h3 className="font-bold text-lg mb-4">Terms of Service</h3>
          <div className="space-y-4 text-sm">
            <p>
              By using Nyako Bet Assistant, you agree to these Terms of Service. Please read them carefully.
            </p>
            
            <h4 className="font-semibold">1. Account Responsibility</h4>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
              responsibility for all activities that occur under your account.
            </p>
            
            <h4 className="font-semibold">2. Acceptable Use</h4>
            <p>
              You agree not to use the service for any unlawful purpose or in any way that might harm, damage, or 
              disparage any other party.
            </p>
            
            <h4 className="font-semibold">3. Predictions</h4>
            <p>
              All predictions are for entertainment purposes only. We do not guarantee accuracy of any predictions or 
              statistics shown on this platform.
            </p>
            
            <h3 className="font-bold text-lg mt-8 mb-4">Privacy Policy</h3>
            
            <h4 className="font-semibold">1. Information We Collect</h4>
            <p>
              We collect personal information such as email addresses and usernames to provide and improve our service. 
              We also collect prediction data to personalize your experience.
            </p>
            
            <h4 className="font-semibold">2. How We Use Information</h4>
            <p>
              Your data will be protected and never sold to third parties. We may use your email to send important 
              notifications about your account or service updates.
            </p>
            
            <h4 className="font-semibold">3. Data Security</h4>
            <p>
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, 
              or destruction of your personal information.
            </p>
            
            <h4 className="font-semibold">4. Changes to This Policy</h4>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page.
            </p>
          </div>
        </div>
        
        <Button
          onClick={onClose}
          className="w-full mt-6"
          darkMode={darkMode}
        >
          I Understand
        </Button>
      </div>
    </Modal>
  );
}