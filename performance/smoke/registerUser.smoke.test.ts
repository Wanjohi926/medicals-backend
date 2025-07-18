
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
};

function randomEmail(): string {
    return `user${Math.floor(Math.random() * 1000000)}@example.com`;
}

export default function () {
    const url = 'http://localhost:8081/user'; 

    const payload = JSON.stringify({
       first_name: "John",
       last_name: "Doe",
       email: randomEmail(),
       password: "securePassword123",
       contact_phone: "0712345678",
       address: "Kenya",
       role: "user"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 201': (r) => r.status === 201,
        'message present': (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return body.message !== undefined;
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
