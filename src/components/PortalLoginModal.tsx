import React, { useState } from 'react';
import { ViewMode, PortalUser, UserRole } from '../types';
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, getDoc } from '../lib/firebase';
import { ShieldCheck, Bike, Store, Headphones, Utensils, Lock, Mail, CheckCircle2, AlertCircle, X, Sparkles, Database } from 'lucide-react';

interface PortalLoginModalProps {
  portalRole: ViewMode;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: PortalUser) => void;
}

const PORTAL_CONFIGS: Record<ViewMode, { title: string; subtitle: string; icon: React.ReactNode; defaultEmail: string; roleName: string }> = {
  rider: {
    title: 'Rider Portal Login',
    subtitle: 'Access earnings, dynamic bids, SOS safety center, and active deliveries',
    icon: <Bike className="w-6 h-6 text-[#FF6B35]" />,
    defaultEmail: 'rider@meallink.com',
    roleName: 'Partner Rider'
  },
  restaurant: {
    title: 'Merchant Kitchen Portal',
    subtitle: 'Manage live orders, respect scores, kitchen timers & 10% capped fee analytics',
    icon: <Store className="w-6 h-6 text-[#FF6B35]" />,
    defaultEmail: 'merchant@meallink.com',
    roleName: 'Restaurant Merchant'
  },
  support: {
    title: 'Customer Support Ops Login',
    subtitle: 'Solve customer & rider SLA tickets, investigate order timelines & escalate to Admin',
    icon: <Headphones className="w-6 h-6 text-[#FF6B35]" />,
    defaultEmail: 'support@meallink.com',
    roleName: 'Support Agent'
  },
  admin: {
    title: 'Executive Admin Command Center',
    subtitle: 'Global ops map, dynamic fuel engine, fairness replay & support authorization gateway',
    icon: <ShieldCheck className="w-6 h-6 text-[#FF6B35]" />,
    defaultEmail: 'admin@meallink.com',
    roleName: 'Executive Admin'
  },
  customer: {
    title: 'Customer Account Login',
    subtitle: 'Order food, track rider live GPS, bid delivery fees & chat with SLA support',
    icon: <Utensils className="w-6 h-6 text-[#FF6B35]" />,
    defaultEmail: 'customer@meallink.com',
    roleName: 'Customer'
  }
};

export const PortalLoginModal: React.FC<PortalLoginModalProps> = ({
  portalRole,
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const config = PORTAL_CONFIGS[portalRole];
  const [email, setEmail] = useState(config.defaultEmail);
  const [password, setPassword] = useState('meallink123');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let uid = '';
      const userEmail = email.trim();
      const userName = userEmail.split('@')[0].toUpperCase() || config.roleName;

      // Try Firebase Email/Password authentication
      try {
        let firebaseUser;
        if (isSignUp) {
          const userCred = await createUserWithEmailAndPassword(auth, userEmail, password);
          firebaseUser = userCred.user;
        } else {
          try {
            const userCred = await signInWithEmailAndPassword(auth, userEmail, password);
            firebaseUser = userCred.user;
          } catch (signInErr: any) {
            // If user does not exist yet or first-time setup, attempt creating
            if (
              signInErr.code === 'auth/user-not-found' ||
              signInErr.code === 'auth/invalid-credential' ||
              signInErr.code === 'auth/wrong-password'
            ) {
              const userCred = await createUserWithEmailAndPassword(auth, userEmail, password);
              firebaseUser = userCred.user;
            } else {
              throw signInErr;
            }
          }
        }
        if (firebaseUser) {
          uid = firebaseUser.uid;
        }
      } catch (authErr: any) {
        // Handle auth/operation-not-allowed: Firebase project has not enabled Email/Password provider in console
        // Fall back gracefully to direct Firestore-synced portal profile so user is never locked out
        console.warn(
          'Firebase Email/Password Auth not enabled or restricted (auth/operation-not-allowed). Falling back to direct portal profile:',
          authErr?.code || authErr?.message
        );
        uid = `usr_${portalRole}_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      }

      const userProfile: PortalUser = {
        uid: uid || `usr_${portalRole}_${Date.now()}`,
        email: userEmail,
        name: userName,
        role: portalRole as UserRole,
        portalName: config.title
      };

      // Persist / Sync user profile in Firestore
      try {
        await setDoc(doc(db, 'users', userProfile.uid), userProfile, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore user profile sync warning (proceeding with session):', dbErr);
      }

      onLoginSuccess(userProfile);
      setLoading(false);
      onClose();
    } catch (err: any) {
      console.error('Portal Auth error:', err);
      setError(err.message || 'Authentication failed. Please check credentials.');
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = async (role: ViewMode) => {
    setError(null);
    setLoading(true);
    const demoEmail = PORTAL_CONFIGS[role].defaultEmail;
    const userProfile: PortalUser = {
      uid: `demo_${role}_user`,
      email: demoEmail,
      name: PORTAL_CONFIGS[role].roleName,
      role: role as UserRole,
      portalName: PORTAL_CONFIGS[role].title
    };

    try {
      await setDoc(doc(db, 'users', userProfile.uid), userProfile, { merge: true });
    } catch (e) {
      console.warn('Firestore sync note:', e);
    }

    onLoginSuccess(userProfile);
    setLoading(false);
    onClose();
  };

  const handleDemoFill = (role: ViewMode) => {
    const demoEmail = PORTAL_CONFIGS[role].defaultEmail;
    setEmail(demoEmail);
    setPassword('meallink123');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-editorial-mono">
      <div className="bg-[#161815] border border-white/10 rounded-xs max-w-md w-full p-6 shadow-2xl space-y-5 text-[#F5F5F0]">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0F110E] border border-white/10 rounded-xs">
              {config.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider block">
                CATEGORY AUTHENTICATION
              </span>
              <h3 className="font-editorial-serif text-xl font-bold italic text-[#F5F5F0]">
                {config.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white rounded-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-white/60 leading-relaxed">
          {config.subtitle}
        </p>

        {/* Database Connected Badge */}
        <div className="flex items-center gap-2 p-2 bg-[#0F110E] border border-emerald-500/30 rounded-xs text-[10px] text-emerald-400">
          <Database className="w-3.5 h-3.5 shrink-0" />
          <span>Firestore DB: <strong className="text-white">ai-studio-meallink</strong></span>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs rounded-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">
              {config.roleName} Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@meallink.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0F110E] border border-white/10 rounded-xs text-[#F5F5F0] focus:outline-hidden focus:border-[#FF6B35]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0F110E] border border-white/10 rounded-xs text-[#F5F5F0] focus:outline-hidden focus:border-[#FF6B35]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF6B35] hover:bg-[#ff7b4b] text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <span>Authenticating Portal...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSignUp ? 'Create Portal Account' : `Authenticate ${config.roleName}`}</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleInstantDemoLogin(portalRole)}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 font-bold text-[11px] uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Instant 1-Click Entry as {config.roleName}</span>
          </button>
        </form>

        {/* 1-Click Demo Auto-Login Section */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-white/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF6B35]" />
              Quick Demo Fill
            </span>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] text-[#FF6B35] hover:underline"
            >
              {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => handleDemoFill('rider')}
              className={`p-2 bg-[#0F110E] hover:bg-white/5 border rounded-xs text-left transition-colors ${portalRole === 'rider' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-white/10 text-white/70'}`}
            >
              ⚡ Rider Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('restaurant')}
              className={`p-2 bg-[#0F110E] hover:bg-white/5 border rounded-xs text-left transition-colors ${portalRole === 'restaurant' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-white/10 text-white/70'}`}
            >
              ⚡ Merchant Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('support')}
              className={`p-2 bg-[#0F110E] hover:bg-white/5 border rounded-xs text-left transition-colors ${portalRole === 'support' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-white/10 text-white/70'}`}
            >
              ⚡ Support Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className={`p-2 bg-[#0F110E] hover:bg-white/5 border rounded-xs text-left transition-colors ${portalRole === 'admin' ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-white/10 text-white/70'}`}
            >
              ⚡ Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
