import jwt from 'jsonwebtoken';

// Lấy secret và thời gian hết hạn từ biến môi trường (hoặc dùng giá trị mặc định)
const JWT_SECRET = process.env.JWT_SECRET_KEY || '86f0f8b0e4124392102531eb911e1aa546f6e6b87ca7e18cd457097463830f4e2bacba13ac3cbdbb949c54f106159ba294037c8a6b6b97275ae4c505b7b82578';
const JWT_EXPIRES_TIME = '1440m';
console.log(JWT_EXPIRES_TIME);
console.log(JWT_SECRET);

/**
 * Hàm encodedToken: tạo JWT từ thông tin của user.
 *
 * @param {Object} user - Đối tượng user chứa các thông tin cần thiết (ví dụ: email, id).
 * @param {String} expire - Thời gian hết hạn của token (mặc định là JWT_EXPIRES_TIME).
 * @returns {String} token - JWT được tạo.
 */
export const encodedToken = async (user, expire = JWT_EXPIRES_TIME) => {
  try {
    const payload = {
      iss: process.env.JWT_ISS || 'default_issuer',
      sub: user.email,    
      userId: user.id,    
    };
    console.log("📌 Payload trước khi tạo token:", payload);

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1440m' });
    console.log("Generated token:", token);

    return token;
  } catch (error) {
    console.error('Error creating JWT:', error.message);
    throw new Error('Failed to generate JWT');
  }
};



export const verifyJWT = async (token) => {
  try {
    console.log("token sắp giải mã",token);
    const decoded = await jwt.verify(token, JWT_SECRET);
    return decoded; // Trả về payload đã giải mã
  } catch (error) {
    console.error('Error verifying JWT:', error.message);
    return null; 
  }
};

export const logTokenGeneration = async (user, expire = JWT_EXPIRES_TIME) => {
  try {
    const token = await encodedToken(user, expire);
    console.log("Token generation successful. Token:", token);
    return token;
  } catch (error) {
    console.error("Token generation failed:", error.message);
    throw error;
  }
};