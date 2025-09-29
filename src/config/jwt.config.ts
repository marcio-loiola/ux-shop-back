import { config } from 'dotenv';
config();

export const jwtConfig = {
  privateKey: process.env.JWT_SECRET,
  signOptions: { expiresIn: '60s' },
};
