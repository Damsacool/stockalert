import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

 const loadProfile = async (userId) => {
  try {
    // Try direct query (RLS is disabled)
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile query error:', profileError);
      setProfile(null);
      setLoading(false);
      return;
    }
    
    setProfile(profileData);
    setLoading(false);
  } catch (error) {
    console.error('Error loading profile:', error);
    setProfile(null);
    setLoading(false);
  }
};


  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signUp = async (email, password, fullName, role = 'worker') => {
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) return { data: null, error };

    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
          created_by: user?.id || authData.user.id
        }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
    }

    return { data: authData, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    return { error };
  };

  const isOwner = profile?.role === 'owner';
  const isWorker = profile?.role === 'worker';

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isOwner,
    isWorker
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};