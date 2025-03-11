import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [category,setCategory]=useState('');
  const [isSellerloggedIn, setIsSellerLoggedIn] = useState(false);
  const [price,setPrice]=useState('');
  const [title,setTitle]=useState('');
  return (
    <AuthContext.Provider value={{ user, setUser,category,setCategory,isSellerloggedIn, setIsSellerLoggedIn,price,setPrice,title,setTitle }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Define children as required
};
export const useAuth = () => useContext(AuthContext);