import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Account from "../models/account.js";
import User from "../models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/account/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: google_id, emails, displayName, photos } = profile;
        const email = emails[0].value;
        const avatar = photos[0].value;

        // Kiểm tra nếu đã có tài khoản local với email này
        let account = await Account.findOne({ where: { email } });

        if (account) {
          // Nếu đã có tài khoản local nhưng chưa có google_id, cập nhật google_id
          if (!account.google_id) {
            account.google_id = google_id;
            await account.save();
          }
        } else {
          // Nếu chưa có tài khoản, tạo mới
          account = await Account.create({
            email,
            google_id,
            provider: "google",
            is_verified: true,
          });

          await User.create({
            account_id: account.id,
            name: displayName,
            username: email.split("@")[0],
            avatar,
          });
        }

        return done(null, account);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize & Deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const account = await Account.findByPk(id);
    done(null, account);
  } catch (error) {
    done(error, null);
  }
});

// 🔥 Export passport để sử dụng ở các file khác
export default passport;
