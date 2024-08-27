import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userAuthData")) || null
  );

  const setCredential = (userData) => {
    setUser(userData);
  };

  const removeCredential = () => {
    setUser(null);
    localStorage.removeItem("userAuthData");
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("userAuthData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userAuthData");
    }
  }, [user]);

  return (
    <authContext.Provider value={{ setCredential, removeCredential, user }}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  const context = useContext(authContext);

  if (context === undefined) {
    throw new Error("You use the context outside the provider");
  }
  return context;
}

export { AuthProvider, useAuth };
