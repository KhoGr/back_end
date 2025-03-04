const sessions = new Map();

/**
 * Tạo phiên đăng nhập mới.
 * @param {Number} userId - ID của tài khoản.
 * @param {String} deviceInfo - Thông tin thiết bị (ví dụ: user-agent).
 * @returns {String} sessionId
 */
export const createSession = (userId, deviceInfo) => {
  // Tạo sessionId dựa trên timestamp và chuỗi ngẫu nhiên
  const sessionId =
    Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  sessions.set(sessionId, {
    userId,
    deviceInfo,
    createdAt: new Date(),
    active: true,
  });
  return sessionId;
};

export const getSession = (sessionId) => sessions.get(sessionId);

export const revokeSession = (sessionId) => sessions.delete(sessionId);

export const listSessionsForUser = (userId) => {
  const userSessions = [];
  sessions.forEach((session, id) => {
    if (session.userId === userId) {
      userSessions.push({ sessionId: id, ...session });
    }
  });
  return userSessions;
};

export const revokeAllSessionsForUser = (userId) => {
  sessions.forEach((session, id) => {
    if (session.userId === userId) {
      sessions.delete(id);
    }
  });
};