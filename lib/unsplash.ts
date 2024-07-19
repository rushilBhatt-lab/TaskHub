import { createApi } from 'unsplash-js';

export const unsplash = createApi({
	accessKey: process.env.NEXT_APP_PUBLIC_UNSPLASH_ACCESS_KEY!,
	fetch: fetch,
});
