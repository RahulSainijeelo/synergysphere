'use client';

import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* App Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 3C6.686 3 4 5.686 4 9v2.5A1.5 1.5 0 0 0 5.5 13H6v2a4 4 0 0 0 8 0v-2h.5a1.5 1.5 0 0 0 1.5-1.5V9c0-3.314-2.686-6-6-6zM9 15v-2h2v2a2 2 0 1 1-2 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-lg sm:px-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900">
              Login into account
            </h2>
            <Link
              href="/sign-up"
              className="text-sm text-orange-500 hover:text-orange-600 underline"
            >
              signup instead
            </Link>
          </div>

          <Form.Root className="space-y-6" onSubmit={handleSubmit}>
            <Form.Field name="email">
              <div className="space-y-2">
                <Form.Label asChild>
                  <Label.Root className="block text-sm font-medium text-gray-700">
                    Email
                  </Label.Root>
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field name="password">
              <div className="space-y-2">
                <Form.Label asChild>
                  <Label.Root className="block text-sm font-medium text-gray-700">
                    Password
                  </Label.Root>
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-start">
              <Link
                href="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Submit asChild>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </Form.Submit>
          </Form.Root>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
