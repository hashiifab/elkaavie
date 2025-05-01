import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../lib/api';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('GoogleCallback component mounted');
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const rememberMe = searchParams.get('remember_me') === 'true';
    
    console.log('Token from URL:', token ? 'Present' : 'Not present');
    console.log('Error from URL:', error || 'None');
    // console.log('Remember me from URL:', rememberMe);
    
    if (error) {
      console.error('Error in URL:', error);
      setError('Google login failed: ' + error);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      return;
    }
    
    if (token) {
      console.log('Token found, storing in ' + (rememberMe ? 'localStorage' : 'sessionStorage'));
      // Store the token based on remember me setting
      if (rememberMe) {
        localStorage.setItem('auth_token', token);
      } else {
        sessionStorage.setItem('auth_token', token);
      }
      
      // Get user data
      console.log('Fetching user data...');
      authApi.getUser()
        .then(user => {
          console.log('User data received:', user);
          localStorage.setItem('user_data', JSON.stringify(user));
          
          // Redirect to home page instead of login
          console.log('Redirecting to home page');
          navigate('/');
        })
        .catch(error => {
          console.error('Failed to get user data:', error);
          if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
          }
          setError('Failed to get user data. Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        });
    } else {
      console.error('No token in URL');
      setError('No token received. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">
          {error ? 'Login Error' : 'Completing login...'}
        </h1>
        {error ? (
          <p className="text-red-500 mb-4">{error}</p>
        ) : (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        )}
      </div>
    </div>
  );
} 