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
  registerStaff
} from "../controllers/account.controller.js";
import  passport  from "../middlewares/passport.js";
import { jwtAuthentication } from "../middlewares/passport.middleware.js";
import { checkLogin } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/upload.middleware.js"
const accountApi = Router();
//đăng ký qua FE thành công

accountApi.post("/register", registerLocal);
accountApi.post("/staff-register", registerStaff);


accountApi.get("/verify-account", verifyAccount);
// Đăng nhập qua FE thành công 
accountApi.post("/login", checkLogin,postLogin);
accountApi.post("/logout", postLogout);
accountApi.get("/me",jwtAuthentication,getMe);


//quên mật khẩu
accountApi.post("/reset-password-request", requestPasswordReset);

accountApi.post("/reset-password", resetPassword);
//update mật khẩu

accountApi.put('/update-password', jwtAuthentication, updatePassword);
accountApi.put("/update-avt",upload.single("avatar"), jwtAuthentication, changeAvatar);// bug
accountApi.get("/profile", jwtAuthentication, getUserProfile);
accountApi.put("/update-profile", jwtAuthentication, updateUserProfile);// thành công nhưng cần bổ sung bảo mật


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
