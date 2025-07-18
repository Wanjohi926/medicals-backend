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
            name: 'Login Soak Test',
        },
    },
};

export default function () {
    const payload = JSON.stringify({
        email: 'jondoe@gmail.com',
        password: '12345678',
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const res = http.post(`${BASE_URL}/user/login`, payload, { headers });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'returns a token': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return typeof body.token === 'string';
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
