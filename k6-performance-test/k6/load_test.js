import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s',
};

export default function () {
  const res = http.get('https://eticket-hub-api-production.up.railway.app/api');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
