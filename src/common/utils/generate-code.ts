import { randomInt } from 'crypto';

export const generateCode = () => randomInt(100000, 999999).toString();
