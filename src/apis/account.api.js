import { Router } from "express";
import {
  registerLocal,
  postLogin,
  verifyAccount,
  postLogout,
  requestPasswordReset,
  resetPassword,
  updatePassword,  
  changeAvatar,
  getUserProfile,
  updateUserProfile,
  googleLoginCallback,
  getMe,
  registerStaff,
  postLoginWithCustomerId,
  postLoginWithStaffId
} from "../controllers/account.controller.js";
import  passport  from "../middlewares/passport.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { checkLogin } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/upload.middleware.js"
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const accountApi = Router();
accountApi.post("/login-with-customer", postLoginWithCustomerId);
accountApi.post("/login-with-staff", postLoginWithStaffId);


accountApi.post("/register", registerLocal);
accountApi.post("/staff-register", registerStaff);



accountApi.get("/verify-account", verifyAccount);

accountApi.post("/login", checkLogin,postLogin); //login bất kỳ
accountApi.post("/admin-login", checkLogin,postLogin); //login cho admin



accountApi.post("/logout", postLogout);
accountApi.get("/me",jwtAuthentication,getMe);


accountApi.post("/reset-password-request", requestPasswordReset);

accountApi.post("/reset-password", resetPassword);

accountApi.put('/update-password', jwtAuthentication, updatePassword);
accountApi.put("/update-avt",upload.single("avatar"), changeAvatar);
accountApi.get("/profile", jwtAuthentication, getUserProfile);
accountApi.put("/update-profile", jwtAuthentication, updateUserProfile);


// Route bắt đầu đăng nhập Google
accountApi.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

accountApi.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/google/fail" }),
  googleLoginCallback
);

//xong đến đây


//đóng hòm
export default accountApi;
