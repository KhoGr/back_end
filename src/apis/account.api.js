import { Router } from "express";
import {
  registerLocal,
  postLogin,
  verifyAccount,
  postLogout,
  requestPasswordReset,
  resetPassword,
  updatePassword,  
  ChangeAvt,
  getUserProfile,
  updateUserProfile,
  googleLoginCallback
} from "../controllers/account.controller.js";
import  passport  from "../middlewares/passport.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";

const accountApi = Router();
//đăng ký

accountApi.post("/register", registerLocal);

accountApi.get("/verify-account", verifyAccount);
// Đăng nhập
accountApi.post("/login", postLogin);
accountApi.post("/logout", postLogout);

//quên mật khẩu
accountApi.post("/reset-password-request", requestPasswordReset);

accountApi.post("/reset-password", resetPassword);

accountApi.put('/update-password', jwtAuthentication, updatePassword);
accountApi.put("/update-avt", jwtAuthentication, ChangeAvt);// chưa test
accountApi.get("/profile", jwtAuthentication, getUserProfile);
accountApi.put("/update-profile", jwtAuthentication, updateUserProfile);// chưa test


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
