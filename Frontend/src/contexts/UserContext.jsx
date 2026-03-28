import { createContext, useContext, useState, useEffect } from "react";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    fullname: {
      firstname: "",
      lastname: "",
    }
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.type === "user" && userData?.data) {
      setUser(userData.data);
    }
  }, []);

  // Listen for storage changes (logout in another tab or window)
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || userData.type !== "user") {
        setUser({
          email: "",
          fullname: {
            firstname: "",
            lastname: "",
          }
        });
      } else {
        setUser(userData.data);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <userDataContext.Provider value={{ user, setUser }}>
      {children}
    </userDataContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(userDataContext);
  return { user, setUser };
};

export default UserContext;
