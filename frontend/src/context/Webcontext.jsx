import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export const WebContext = createContext();

const WebContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [userData, setUserData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({});
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     const fetchProducts = async () => {
  //       const response = await api.get("/products"); // Gọi API để lấy danh sách sản phẩm
  //       setProducts(response.data); // Sửa đổi để thiết lập products là mảng
  //     };
  //     fetchProducts();
  //   }, []);

  //   useEffect(() => {
  //     const fetchUsers = async () => {
  //       const response = await api.get("/users"); // Gọi API để lấy danh sách sản phẩm
  //       setUsers(response.data); // Sửa đổi để thiết lập products là mảng
  //     };
  //     fetchUsers();
  //   }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const isTruePwd = await isTruePassword(password, email);
    if (isTruePwd) {
      toast.success("Login Success");
      setLoginStatus(true);
      navigate("/");
    } else {
      toast.error("Wrong email or password");
    }
  };

  // Thêm useEffect để theo dõi sự thay đổi của loginStatus
  useEffect(() => {}, [loginStatus]);

  const onRegisterSubmitHandler = async (event) => {
    event.preventDefault();
    const isEmailExist = await checkEmailExists(email);
    if (isEmailExist) {
      toast.error("Email already exist");
    } else {
      const newUserData = { first_name, last_name, email, password };
      setUserData(newUserData);
      const newUserId =
        users.length > 0 ? parseInt(users[users.length - 1].id) + 1 : 1;
      const newUser = { id: newUserId, ...newUserData };
      try {
        await api.post("/users", newUser);
        setUsers((prevUsers) => [...prevUsers, newUser]);
        toast.success("Register successfully");
        navigate("/login");
      } catch (error) {
        toast.error("Error.");
      }
    }
  };

  // Thêm useEffect để theo dõi sự thay đổi của userData
  useEffect(() => {}, [userData]);

  // checkEmailExists function
  const checkEmailExists = async (email) => {
    const result = await users.find((user) => user.email === email);
    if (!result) {
      return false;
    } else {
      return true;
    }
  };
  const isTruePassword = async (password, email) => {
    const result = await users.find((user) => user.email === email);
    if (result && result.password === password) {
      return true;
    } else {
      return false;
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      cartData[itemId][size] = quantity; // Cập nhật số lượng
    } else {
      console.error(cartData[itemId]);
    }
    setCartItems(cartData);
  };
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product.pid === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const value = {
    products,
    users,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    loginStatus,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setUserData,
    setLoginStatus,
    onSubmitHandler,
    onRegisterSubmitHandler,
    navigate,
  };

  return (
    <WebContext.Provider value={value}>{props.children}</WebContext.Provider>
  );
};
export default WebContextProvider;
