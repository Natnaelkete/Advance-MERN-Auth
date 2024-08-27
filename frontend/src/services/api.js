import axios from "axios";

export const SignupApi = async (formData) => {
  const { data } = await axios.post("/api/users/signup", formData);
  return data;
};

export const LoginApi = async (formData) => {
  const { data } = await axios.post("/api/users/login", formData);
  console.log(data);
  return data;
};

export const LogoutApi = async () => {
  const { data } = await axios.post("/api/users/logout");
  return data;
};
