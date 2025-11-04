import React from 'react';
import '../LoginPage.css'; 

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-box">
        <h1>Image Search Website</h1>
        <p>Please log in to continue</p>

        <a href="http://localhost:5000/auth/google" className="login-button google">
          Login with Google
        </a>
        
        <a href="http://localhost:5000/auth/github" className="login-button github">
          Login with GitHub
        </a>
      </div>
    </div>
  );
};

export default LoginPage;