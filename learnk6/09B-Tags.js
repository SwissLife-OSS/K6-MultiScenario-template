import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { check } from 'k6';

let myTrend = new Trend('my_trend');

export default function () {
  // Add tag to request metric data
  let res = http.get('http://httpbin.org/', {
    tags: {
      my_tag: "I'm a tag",
    },
  });

  // Add tag to check
  check(
    res,
    { 'status is 200': (r) => r.status === 200 },
    { my_tag: "I'm a tag" },
  );

  // Add tag to custom metric
  myTrend.add(res.timings.connecting, { my_tag: "I'm a tag" });
}
