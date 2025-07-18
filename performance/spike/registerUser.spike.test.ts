import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';

export const options = {
    stages: [
        { duration: '10s', target: 10 }, 
        { duration: '10s', target: 200 },
        { duration: '20s', target: 300 },
        { duration: '10s', target: 10 },
        { duration: '10s', target: 0 },
    ],
    ext: {
        loadimpact: {
            name: 'User Registration Spike Test',
        },
    },
};

export default function () {
    const randomEmail = `user${Math.floor(Math.random() * 1000000)}@example.com`;

    const payload = JSON.stringify({
        first_name: 'Spike',
        last_name: 'Tester',
        email: randomEmail,
        password: '12345678',
        contact_phone: '0700000000',
        address: 'Nairobi, Kenya',
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
