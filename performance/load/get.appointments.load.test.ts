import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';
export const options = {
    stages: [
        { duration: '30s', target: 40 },
        { duration: '40s', target: 50 },
        { duration: '10s', target: 0 },
    ],
    ext: {
        loadimpact: {
            name: 'Appointments GET Load Test',
        },
    },
};

export default function () {
    // If authentication is required, add a valid token here
    // const token = 'YOUR_VALID_TOKEN';
    const res = http.get(`${BASE_URL}/appointments`, {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
        },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has data array': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}