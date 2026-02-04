import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    // Extends the built-in session type
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image?: string;
        } & DefaultSession['user'];
    }

    // Extend the built-in user type
    interface User {
        id: string;
        name: string;
        email: string;
        image?: string;
    }
}

declare module 'next-auth/jwt' {
    // Extend the built-in JWT type
    interface JWT {
        id: string;
        name: string;
        email: string;
        image?: string;
    }
}