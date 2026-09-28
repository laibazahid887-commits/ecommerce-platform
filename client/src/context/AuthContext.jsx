import { createContext, useContext, useState } from "react";
 const AuthContext = createContext(); 
 function AuthProvider({ children }) {
     const savedUser = localStorage.getItem("user"); 
     const [user, setUser] = useState( savedUser ? JSON.parse(savedUser) : null );
     const login = (userData) => { localStorage.setItem("user", JSON.stringify(userData)); 
        setUser(userData); }; 
        const logout = () => { localStorage.removeItem("token"); 
            localStorage.removeItem("user"); setUser(null); };
             return ( <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, }} > 
             {children} </AuthContext.Provider> ); } 
              export function useAuth() { return useContext(AuthContext); } 
              export default AuthContext;
               export { AuthProvider };