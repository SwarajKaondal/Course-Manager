import React, {createContext, useContext, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "../utils/LocalStorage";
import {User} from "../models/models";

interface AuthProviderProps {
    children: React.ReactNode;
}

export type AuthContextType = {
    user: User | null,
    login: (data: User) => Promise<void>,
    logout: () => void,
};


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useLocalStorage<User | null>("user", null);
    const navigate = useNavigate();

    // Call this function when you want to authenticate the user
    const login = async (data: User): Promise<void> => {
        setUser(data);
        navigate("/admin");
    };

    // Call this function to sign out the logged-in user
    const logout = (): void => {
        setUser(null);
        navigate("/", {replace: true});
    };

    const value: AuthContextType = useMemo(
        () => ({
            user,
            login,
            logout,
        }),
        [user, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
