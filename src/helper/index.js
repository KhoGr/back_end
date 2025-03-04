import bcrypt from 'bcryptjs';

/**
 * Tạo username từ email và id tài khoản.
 * @param {string} email - Email của người dùng.
 * @param {string} id - ID của tài khoản.
 * @returns {string} Username được tạo từ email và id.
 */
export const createUsername = (email = '', id = '') => {
  const idStr = id.toString();
  return (
    email.toString().split('@')[0] + idStr.slice(idStr.length - 5, idStr.length)
  );
};



/**
 * Băm mật khẩu bằng bcrypt.
 * @param {string} password - Mật khẩu cần băm.
 * @returns {Promise<string>} Mật khẩu đã được băm.
 */
export const hashPassword = async (password = '') => {
  const saltRounds = parseInt(process.env.SALT_ROUND, 10);
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return hashPassword;
};


/**
 * Phân trang kết quả truy vấn.
 * @param {Object} query - Query object từ request.
 * @param {number} defaultLimit - Số lượng mặc định trên một trang.
 * @returns {Object} Offset và Limit để sử dụng trong truy vấn cơ sở dữ liệu.
 */
export const getPagination = (query, defaultLimit = 10) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || defaultLimit;
    const offset = (page - 1) * limit;
  
    return { offset, limit };
  }