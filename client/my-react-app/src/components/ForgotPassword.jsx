import { useState } from 'react';
import { toast } from "react-toastify";
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { Layers, Mail, Loader2, ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        
        try {
            const response = await api.post("/auth/forgot-password", { email });
            toast.success(response.data.message || "Reset link sent successfully!");
            setEmail(""); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false); 
        }
    };
    
    return (
        <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-8 sm:p-10">
                
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-3">
                        <Layers className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Forgot your password?
                    </h1>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        No worries! Enter the email address associated with your account, and we'll send you instructions to reset your password.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail className="h-4 w-4" />
                            </div>
                            <input 
                                type="email" 
                                name="email"
                                id="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="enter your email" 
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <span className="flex items-center space-x-2">
                                <KeyRound className="h-4 w-4" />
                                <span>Send Reset Link</span>
                            </span>
                        )}
                    </button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center mt-6 pt-6 border-t border-slate-100">
                    <Link 
                        to="/login" 
                        className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Login</span>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;