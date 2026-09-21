import { handleAuth } from './_lib/sveltia-oauth';

export const GET = (request: Request) => handleAuth(request);
