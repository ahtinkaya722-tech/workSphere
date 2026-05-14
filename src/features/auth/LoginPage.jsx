import React, { useState } from 'react';
import '../css/Login.css'; 
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async(e) => {
        e.preventDefault();
        setLoading(true);
        setError('');



        setTimeout( async() => {
            setLoading(false);
            const res = await fetch("http://localhost:5000/members");
            const users = await res.json();

            const user = users.find((u)=>u.email === form.email && u.password === form.password);


            if (user) {
                alert('Login Success');
                localStorage.setItem("user",JSON.stringify(user));
                navigate("/dashboard");

            } else {
                setError('Invalid email or password');
            }
        }, 1000);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome back</h2>
                    <p>Enter your details to access your workspace</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="name@company.com" 
                            value={form.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            value={form.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="#">Sign up</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;