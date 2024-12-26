import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../../redux/user/userSlice";

const ValidateToken = () => {
  const token = Cookies.get("access_token");

  if (!token) {
    // localStorage.removeItem("currentUser"); // Remove user data if token is absent
    const dispatch = useDispatch();
    dispatch(signOutSuccess());

    return false; // Token is not present
  }

  return true; // Token is present
};

export default ValidateToken;
