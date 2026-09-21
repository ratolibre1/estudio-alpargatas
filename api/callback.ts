import { handleCallback } from './_lib/sveltia-oauth';

export const config = { runtime: 'edge' };

export default function handler(request: Request) {
  return handleCallback(request);
}
