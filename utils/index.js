import bcrypt from 'bcrypt';

export const baseUrl = 'http://localhost:3000/';

export const hashPassword = async (pswd) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pswd, salt);
  return hashedPassword;
};
