import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [region, setRegion] = useState(null);
    const [routing, setRouting] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            const savedRegion = localStorage.getItem('region');
            const savedRouting = localStorage.getItem('routing');

            if (savedUser) setUser(JSON.parse(savedUser));
            if (savedToken) setToken(savedToken);
            if (savedRegion) setRegion(savedRegion);
            if (savedRouting) setRouting(JSON.parse(savedRouting));
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData, authToken, userRegion, routingInfo) => {
        setUser(userData);
        setToken(authToken);
        setRegion(userRegion);
        setRouting(routingInfo);

        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        localStorage.setItem('region', userRegion);
        localStorage.setItem('routing', JSON.stringify(routingInfo));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRegion(null);
        setRouting(null);

        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('region');
        localStorage.removeItem('routing');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <UserContext.Provider
            value={{
                user,
                token,
                region,
                routing,
                loading,
                login,
                logout,
                updateUser,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}
