import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 5, duration: '30s' },
        { target: 15, duration: '1m' },
        { target: 10, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response

  const vars = {}

  group('Login and order - https://pizza.jaidentrippdevops2025.click/', function () {
    // Login
    response = http.put(
      'https://pizza-service.jaidentrippdevops2025.click/api/auth',
      '{"email":"d@jwt.com","password":"diner"}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          origin: 'https://pizza.jaidentrippdevops2025.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    check(response, { 'status equals 200': response => response.status.toString() === '200' })

    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body);
      fail('Login was *not* 200');
    }

    vars['token'] = jsonpath.query(response.json(), '$.token')[0]

    sleep(5)

    // Get menu
    response = http.get('https://pizza-service.jaidentrippdevops2025.click/api/order/menu', {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        'if-none-match': 'W/"1fc-cgG/aqJmHhElGCplQPSmgl2Gwk0"',
        origin: 'https://pizza.jaidentrippdevops2025.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    })

    // Get franchise
    response = http.get(
      'https://pizza-service.jaidentrippdevops2025.click/api/franchise?page=0&limit=20&name=*',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          'if-none-match': 'W/"b4-aQuDSGgd0qgiZ1IS9P78CzScKKU"',
          origin: 'https://pizza.jaidentrippdevops2025.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )
    sleep(23.2)

    // Purchase pizza
    response = http.post(
      'https://pizza-service.jaidentrippdevops2025.click/api/order',
      '{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":1}',
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          origin: 'https://pizza.jaidentrippdevops2025.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
      }
    )

    check(response, { 'status equals 200': response => response.status.toString() === '200' })

    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body);
      fail('Login was *not* 200');
    }

    vars['pizzaJwt'] = response.json().jwt
    sleep(2.9)

    // Verify pizza
    response = http.post(
      'https://pizza-factory.cs329.click/api/order/verify',
      //'{"jwt":"eyJpYXQiOjE3NjM1MDYyNzEsImV4cCI6MTc2MzU5MjY3MSwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9TcF94VzhlM3kwNk1KS3ZIeW9sRFZMaXZXX2hnTWxhcFZSUVFQVndiY0UifQ.eyJ2ZW5kb3IiOnsiaWQiOiJqbXQyNjgiLCJuYW1lIjoiSmFpZGVuIFRyaXBwIn0sImRpbmVyIjp7ImlkIjoyLCJuYW1lIjoicGl6emEgZGluZXIiLCJlbWFpbCI6ImRAand0LmNvbSJ9LCJvcmRlciI6eyJpdGVtcyI6W3sibWVudUlkIjoxLCJkZXNjcmlwdGlvbiI6IlZlZ2dpZSIsInByaWNlIjowLjAwMzh9XSwic3RvcmVJZCI6IjEiLCJmcmFuY2hpc2VJZCI6MSwiaWQiOjR9fQ.d5ZmBxQ6r_lYElbcz6EELeHpfUyi5PLsGXiu_mdf3bIm-eHn1t_dFbO7K81r_PIvPEDthWr-TWgGaMNK07MTb-Lg4HZtVSP9JbKJJKSgxTsWqyVR6pQx4yh4HQdxhsQ2S0SovOjog-79sDpkst4Tf2A5jT9OUeVAxhmPk_XRtzCKzavrzvFlYwN2MtR4DUUw9Y2CmC85G277kNIWo423mQLdvxwHo9jr25xAYdEZXcNbk7pZaOPlO-t6HjUhzXRhhsm8rHU-kj0RLwUvPTX-8kziA-5YwczHnCDN9gZXvUSPU6uJ25aJJafV1zyFiSq8c-eWxFyuc5SreVDUlBjhxRHkH1PYCTefzNonh9OBsP20_A6XlYj0vdXRbRP1wdLu_YouaA0B7hujAtnVbz3Mb7ZbZr6nFocp75cWcUh3iXxEnZzurc_tSB3nroQPIcd8w_MuCzLY2D6xT9HVufgtQP9aiRVsm0S_F1XfV7c9xuUwpneXROLXgBWxg1j_GcqzqvKCPHDLLUo9zHCRcqswVeMxCFiQPTAScaJdyqq6sKLwC9DvwK7RbK2JADCgzAHRjQj5G_vhMc9LYxbJPJ02Y1HisJcdIxl27MjnEdm28JL-I4dpuL5lcIH1opvMcIjxwePRdFqkhpcULiqh1QdYRthXfeEZxl_zblTiR-JGyT8"}',
      JSON.stringify({ jwt: vars['pizzaJwt'] }),
      {
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9',
          authorization: `Bearer ${vars['token']}`,
          'content-type': 'application/json',
          origin: 'https://pizza.jaidentrippdevops2025.click',
          priority: 'u=1, i',
          'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'sec-fetch-storage-access': 'active',
        },
      }
    )
  })
}
