
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081'; 

export const options = {
    stages: [
        { duration: '30s', target: 20 },   
        { duration: '30s', target: 100 },  
        { duration: '30s', target: 200 }, 
        { duration: '1m', target: 300 },  
        { duration: '30s', target: 0 }, 
    ],
    ext: {
        loadimpact: {
            name: 'Doctors GET Stress Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/doctors`, {
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
