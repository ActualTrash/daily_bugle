import jwt from 'jsonwebtoken';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth');
    const secret = 'chiapet1';
    try {
        event.locals.auth = jwt.verify(token, secret);
    } catch {
        event.locals.auth = null;
    }
    return await resolve(event);
};
