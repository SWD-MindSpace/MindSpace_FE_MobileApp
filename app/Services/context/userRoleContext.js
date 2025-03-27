import React, { createContext, useState, useContext } from 'react';

// Create the User Role Context
const UserRoleContext = createContext();

// Custom hook to use User Role Context
export const useUserRole = () => {
    return useContext(UserRoleContext);
};

// User Role Provider component
export const UserRoleProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);

    // Set the role in context (can be called after login)
    const updateUserRole = (role) => {
        setUserRole(role);
    };

    return (
        <UserRoleContext.Provider value={{ userRole, updateUserRole }}>
            {children}
        </UserRoleContext.Provider>
    );
};
