import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export const options = {
  scenarios: {
    contacts: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 50,
      timeUnit: '1s',
      startRate: 50,
      stages: [
        { target: 200, duration: '30s' }, // linearly go from 50 iters/s to 200 iters/s for 30s
        { target: 500, duration: '0' }, // instantly jump to 500 iters/s
        { target: 500, duration: '30s' }, // continue with 500 iters/s for 30 seconds
      ],
    },
  },
};

export default function () {
  // our HTTP request, note that we are saving the response to res, which can be accessed later

  const res = http.get('https://giant.choclab.net');

  sleep(1);

  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
  });
}

