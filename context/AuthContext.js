"use client";
import React, { createContext, useContext,useEffect,useState } from "react"

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {

    const [user,setUser]=useState(null);

    // Normalize user object from various possible backend shapes
    const normalizeUser = (raw) => {
        if (!raw) return {}
        const obj = typeof raw === 'string' ? JSON.parse(raw) : raw
        return {
            name: obj.name || obj.username || obj.fullName || '',
            mobile: obj.mobile || obj.Mobile || obj.phone || '',
            image: obj.image || obj.profilePic || obj.avatar || '',
            profilePic: obj.profilePic || obj.image || obj.avatar || '',
            address: typeof obj.Address === 'string' ? { street: obj.Address } : (obj.address || obj.Address || {}),
            id: obj.id || obj._id || obj.sub || null,
            __raw: obj
        }
    }

    useEffect(() => {
        // Check localStorage for existing user data
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(normalizeUser(storedUser));
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error reading stored user', err)
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    const login = (userData) => {
        const normalized = normalizeUser(userData)
        setUser(normalized);
        try {
            localStorage.setItem('user', JSON.stringify(normalized));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error saving user to localStorage', err)
        }
    };

    const logout=()=>{
        setUser(null);
        localStorage.removeItem('user');
        window.location.href="/login"
    }

  return (
    <AuthContext.Provider value={{user,login,logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () =>{
    return useContext(AuthContext);
}
