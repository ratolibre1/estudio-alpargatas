import { handleCallback } from './_lib/sveltia-oauth';

export const GET = (request: Request) => handleCallback(request);
