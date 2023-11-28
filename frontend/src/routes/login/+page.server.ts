import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const actions = {
    login: async (event) => {
        // 1. Check if the user exists
        // 2. If it does, sign a cookie
        const token = jwt.sign({ username: 'test', role: 'admin' }, 'chiapet1');
        event.cookies.set('auth', token, {secure: false});
        console.log(token);
        // 3. If not, throw an error
        throw redirect(301, '/');
    },
} satisfies Actions;
