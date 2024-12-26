import axios from "axios";
const apiRequest = axios.create({
  baseURL: "http://localhost:5500/api", //for dev

  // baseURL: "https://phoenixlabs-agal.onrender.com/api", //for deployment
  withCredentials: true,
});
export default apiRequest;
