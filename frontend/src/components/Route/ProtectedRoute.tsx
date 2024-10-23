import {Navigate} from "react-router-dom";
import {useAuth} from "../../provider/AuthProvider";
import React from "react";


export const ProtectedRoute = ({children}: { children: React.ReactNode }) => {
    const {user} = useAuth();

    if (!user) {
        return <Navigate to="/"/>;
    }

    return <>{children}</>;
};
