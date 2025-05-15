import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const { signup, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await signup(email, password, name);
      toast.success('Account created! Please check your email to verify.');
      navigate("/verify-email");

    } catch (err) {  
      console.error(err.response?.data); 
      toast.error('Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="backdrop-blur-md bg-white/90 p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Join us today!</p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a18cd1]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a18cd1]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a18cd1]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignUp}
          disabled={isLoading}
          className="w-full bg-[#a18cd1] hover:bg-[#8c6fc3] text-white py-2 rounded-lg font-semibold transition"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#a18cd1] hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};


export default SignUpPage;