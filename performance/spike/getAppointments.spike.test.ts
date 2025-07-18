import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';

export const options ={
    stages: [
        { duration: '10s', target: 10 },
        { duration: '10s', target: 200 },
        { duration: '20s', target: 300 },
        { duration: '10s', target: 10 },
        { duration: '10s', target: 0 },
    ],
    ext: {
        loadimpact: {
            name: 'Appointments GET Spike Test',
        },
    },
}

export default function () {
    const res = http.get(`${BASE_URL}/appointments`,{
        headers: {
            'Content-Type': 'application/json',

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