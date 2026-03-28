import { createContext, useContext, useState, useEffect } from "react";

export const captainDataContext = createContext();

function CaptainContext({ children }) {
  const [captain, setCaptain] = useState({
    email: "",
    fullname: {
      firstname: "",
      lastname: "",
    },
    vehicle: {
      color: "",
      number: "",
      capacity: 0,
      type: "",
    },
    rides: [],
    status: "inactive",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.type === "captain" && userData?.data) {
      setCaptain(userData.data);
    }
  }, []);

  // Listen for storage changes (logout in another tab or window)
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || userData.type !== "captain") {
        setCaptain({
          email: "",
          fullname: {
            firstname: "",
            lastname: "",
          },
          vehicle: {
            color: "",
            number: "",
            capacity: 0,
            type: "",
          },
          rides: [],
          status: "inactive",
        });
      } else {
        setCaptain(userData.data);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <captainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </captainDataContext.Provider>
  );
}

export const useCaptain = () => {
  const { captain, setCaptain } = useContext(captainDataContext);
  return { captain, setCaptain };
};

export default CaptainContext;
