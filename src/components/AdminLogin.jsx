import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import { GlassCard, Button, Input } from './UI';

export default function AdminLogin({ onLogin, loading: externalLoading }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onLogin(email, password, 'admin');
        } catch (err) {
            setError(err.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
                {/* Admin Badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-3xl shadow-2xl mb-6" style={{ background: 'var(--primary-color)' }}>
                        <ShieldCheck size={36} style={{ color: 'var(--bg-main)' }} />
                    </div>
                    <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Admin Portal</h1>
                    <p className="text-xs uppercase tracking-widest font-bold opacity-60" style={{ color: 'var(--text-secondary)' }}>Restricted Access</p>
                </div>

                <GlassCard className="p-8 md:p-10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: 'var(--text-secondary)' }}>Admin Email</label>
                            <Input
                                type="email"
                                icon={Mail}
                                placeholder="admin@shutterbug.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: 'var(--text-secondary)' }}>Password</label>
                            <Input
                                type="password"
                                icon={Lock}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                                <p className="text-xs font-bold" style={{ color: '#ef4444' }}>{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || externalLoading}
                            className="w-full py-4 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all active:scale-95"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {loading || externalLoading ? 'Authenticating...' : 'Access Admin Panel'}
                                <ArrowRight size={16} />
                            </span>
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid var(--card-border)' }}>
                        <a
                            href="/"
                            className="text-xs font-bold uppercase tracking-wider hover:underline transition-all"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            ← Back to Login
                        </a>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
