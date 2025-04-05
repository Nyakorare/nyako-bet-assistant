import React from 'react';

const SignInRegisterModal = ({ setUser }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">
      <h2 className="text-lg font-bold mb-4">Sign In / Register</h2>
      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setUser({ name: 'MockUser' })}>
        Sign In (Mock)
      </button>
    </div>
  </div>
);

export default SignInRegisterModal;
