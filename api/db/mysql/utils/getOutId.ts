import { OkPacketParams } from 'mysql2/promise';
import { parse10Int } from './functions.js';

export function getOutId(response: any): number | null {
  if (!response) return null;

  const arrayResponse = (Array.isArray(response) ? response : [response])[0];
  if (arrayResponse.constructor.name !== 'OkPacket') return null;

  const isOkPacket = arrayResponse.constructor.name === 'OkPacket';
  if (!isOkPacket) return null;

  const outId = isOkPacket ? parse10Int((response as OkPacketParams)?.insertId) : null;
  return response.constructor.name === 'OkPacket' ? outId : null;
}