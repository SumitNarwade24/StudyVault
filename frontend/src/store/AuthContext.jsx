import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = sessionStorage.getItem('user');
            return (savedUser && savedUser !== 'undefined') ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const login = (userData) => {
        setUser(userData);
        if (userData) {
            sessionStorage.setItem('user', JSON.stringify(userData));
        } else {
            sessionStorage.removeItem('user');
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.clear();
    };

    const isTeacher = () => user?.role === 'TEACHER';
    const isStudent = () => user?.role === 'STUDENT';
    const isGuest = () => !user;

    return (
        <AuthContext.Provider value={{ user, login, logout, isTeacher, isStudent, isGuest }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
