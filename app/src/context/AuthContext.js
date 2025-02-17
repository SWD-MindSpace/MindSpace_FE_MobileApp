import React, { createContext, useState } from "react";
import { login } from "@/app/src/services/authService";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const signIn = async (email, password) => {
        try {
            setLoading(true);
            const data = await login(email, password);
            setUser(data);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signIn, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
