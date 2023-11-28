import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, cookies }) => {
    cookies.delete('auth', {secure: false});
    locals.auth = null;
    throw redirect(301, '/');
};
