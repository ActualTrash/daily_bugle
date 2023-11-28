import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const actions = {
    default: async (event) => {
        // 1. Check if the user exists
        const data = await event.request.formData();
        console.log(data);
        const username = data.get('username');
        const password = data.get('password');
        const resp = await fetch(`http://10.10.110.180:8000/api/auth/authenticate?username=${username}&password=${password}`);
        const d = await resp.json();
        console.log(d);
        if ( d.username ) {
            // 2. If it does, sign a cookie
            const token = jwt.sign({ username: d.username, role: d.role }, 'chiapet1');
            event.cookies.set('auth', token, {secure: false});
            console.log(token);
            // 3. If not, throw an error
            throw redirect(301, '/');
        }
    },
} satisfies Actions;
