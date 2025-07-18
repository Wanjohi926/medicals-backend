import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';

export const options = {
    stages: [
        { duration: '1m', target: 20 },
        { duration: '3m', target: 20 },
        { duration: '40s', target: 0 },
    ],
    ext: {
        loadimpact: {
            name: 'Register User Soak Test',
        },
    },
};

export default function () {
    const randomEmail = `random${Math.floor(Math.random() * 100000)}@gmail.com`;

    const payload = JSON.stringify({
        first_name: 'John',
        last_name: 'Doe',
        email: randomEmail,
        password: '12345678',
        contact_phone: '0712345678',
        address: 'Kenya',
        role: 'user',
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const res = http.post(`${BASE_URL}/user`, payload, { headers });

       check(res, {
        'status is 201': (r) => r.status === 201,
        'user object exists': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return typeof body.user === 'object';
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
