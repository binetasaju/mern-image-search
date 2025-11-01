import React from 'react';
import '../LoginPage.css'; // This file does all the work

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-box">
        <h1>Image Search Website</h1>
        <p>Please log in to continue</p>

        {/* --- CORRECTED LINK: Using a relative path that Vercel rewrites to Render --- */}
        <a href="/auth/google" className="login-button google">
          Login with Google
        </a>
        
        {/* --- CORRECTED LINK: Using a relative path that Vercel rewrites to Render --- */}
        <a href="/auth/github" className="login-button github">
          Login with GitHub
        </a>
      </div>
    </div>
  );
};

export default LoginPage;