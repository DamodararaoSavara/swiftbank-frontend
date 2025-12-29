export const logout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
  localStorage.removeItem("userId");
  localStorage.removeItem("otpEmail");

  navigate("/login", { replace: true });
};
