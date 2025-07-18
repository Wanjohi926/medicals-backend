import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8081';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 200 },
    { duration: '30s', target: 400 },
    { duration: '30s', target: 800 },
    { duration: '30s', target: 1600 },
    { duration: '30s', target: 0 },
  ],
  ext: {
    loadimpact: {
      name: 'User LOGIN Breakpoint Test',
    },
  },
};

export default function () {
  const url = `${BASE_URL}/user/login`;

  const payload = JSON.stringify({
    email: 'john435@example.com',
    password: 'securePassword123',
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post(url, payload, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'token or message present': (r) => {
      try {
        if (typeof r.body === 'string') {
          const body = JSON.parse(r.body);
          return typeof body.token === 'string' || typeof body.message === 'string';
        }
        return false;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
