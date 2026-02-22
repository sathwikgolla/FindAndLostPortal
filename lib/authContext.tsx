'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'lost' | 'found' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  location: string;
  postedBy: string; // user id
  role: 'lost' | 'found'; // type of post
  imageUrl: string;
  createdAt: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  users: User[];
  posts: Post[];
  createPost: (title: string, description: string, location: string, role: 'lost' | 'found', imageUrl: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  searchPosts: (query: string, role?: 'lost' | 'found') => Post[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const storedPosts = localStorage.getItem('posts');
    const storedSession = localStorage.getItem('currentSession');

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
    if (storedSession) {
      const session = JSON.parse(storedSession);
      const user = JSON.parse(storedUsers || '[]').find((u: User) => u.id === session.userId);
      if (user) {
        setCurrentUser(user);
      }
    }
    setIsLoading(false);
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  // Save session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentSession', JSON.stringify({
        userId: currentUser.id,
        role: currentUser.role,
        email: currentUser.email,
      }));
    } else {
      localStorage.removeItem('currentSession');
    }
  }, [currentUser]);

  const register = async (email: string, password: string, role: UserRole) => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password, // Note: In production, this should be hashed
      role,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createPost = async (title: string, description: string, location: string, role: 'lost' | 'found', imageUrl: string) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title,
      description,
      location,
      postedBy: currentUser.id,
      role,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    setPosts([...posts, newPost]);
  };

  const deletePost = async (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const searchPosts = (query: string, role?: 'lost' | 'found') => {
    let filtered = posts;

    if (role) {
      filtered = filtered.filter(p => p.role === role);
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.location.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        register,
        login,
        logout,
        users,
        posts,
        createPost,
        deletePost,
        searchPosts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
