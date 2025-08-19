import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Tables } from '../integrations/supabase/types';

type Teacher = Tables<'teachers'>;

interface AuthContextType {
  teacher: Teacher | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  fullName: string;
  school?: string;
  subject?: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const teacherId = localStorage.getItem('teacherId');
    if (teacherId) {
      loadTeacher(teacherId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadTeacher = async (teacherId: string) => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', teacherId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setTeacher(data);
    } catch (error) {
      console.error('Error loading teacher:', error);
      localStorage.removeItem('teacherId');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('authenticate_teacher', {
        p_email: email,
        p_password: password
      });

      if (error) throw error;
      
      if (data) {
        localStorage.setItem('teacherId', data);
        await loadTeacher(data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('register_teacher', {
        p_email: registerData.email,
        p_full_name: registerData.fullName,
        p_password: registerData.password,
        p_school: registerData.school || null,
        p_subject: registerData.subject || null
      });

      if (error) throw error;
      
      if (data) {
        localStorage.setItem('teacherId', data);
        await loadTeacher(data);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('teacherId');
    setTeacher(null);
  };

  const value: AuthContextType = {
    teacher,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};