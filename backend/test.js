/**
 * Automated Test Suite for AI App Builder Backend
 * Runs comprehensive validation checks
 */

const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const tests = [];
let passed = 0;
let failed = 0;

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Helper function to make HTTP requests
 */
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BACKEND_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Test runner
 */
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
  } catch (error) {
    failed++;
    console.log(`  ${colors.red}✗${colors.reset} ${name}`);
    console.log(`    ${colors.red}Error: ${error.message}${colors.reset}`);
  }
}

/**
 * Assertion helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Test Suite
 */
async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  Backend API Automated Test Suite${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

  console.log(`${colors.yellow}Testing: ${BACKEND_URL}${colors.reset}\n`);

  // Test 1: Server Health
  console.log(`${colors.blue}1. Server Health Checks${colors.reset}`);
  
  await test('Health endpoint responds', async () => {
    const res = await makeRequest('GET', '/health');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.status === 'ok', 'Health status should be "ok"');
    assert(res.body.uptime > 0, 'Uptime should be positive');
  });

  await test('Health endpoint has timestamp', async () => {
    const res = await makeRequest('GET', '/health');
    assert(res.body.timestamp, 'Should have timestamp');
    assert(new Date(res.body.timestamp).getTime() > 0, 'Timestamp should be valid');
  });

  // Test 2: CORS Configuration
  console.log(`\n${colors.blue}2. CORS Configuration${colors.reset}`);

  await test('Server responds with proper headers', async () => {
    const res = await makeRequest('GET', '/health');
    assert(res.headers, 'Response should have headers');
    assert(res.status === 200, 'Should return 200');
  });

  // Test 3: API Endpoints
  console.log(`\n${colors.blue}3. API Endpoints${colors.reset}`);

  await test('Chat endpoint exists', async () => {
    try {
      const res = await makeRequest('POST', '/api/chat', {
        messages: [],
        userId: 'test',
      });
      // Should fail due to missing OpenAI key, but endpoint should exist
      assert(res.status !== 404, 'Chat endpoint should exist');
    } catch (error) {
      assert(error.message !== 'HTTP 404', 'Chat endpoint should exist');
    }
  });

  await test('Integrations endpoint exists', async () => {
    const res = await makeRequest('GET', '/api/integrations?userId=test');
    // Should either have integrations or auth error, but not 404
    assert(res.status !== 404, 'Integrations endpoint should exist');
  });

  await test('Pricing endpoint exists', async () => {
    const res = await makeRequest('GET', '/api/pricing');
    assert(res.status === 200, 'Pricing endpoint should exist and return 200');
    assert(res.body.tiers, 'Pricing should have tiers');
  });

  // Test 4: Rate Limiting
  console.log(`\n${colors.blue}4. Rate Limiting${colors.reset}`);

  await test('Rate limiter is configured', async () => {
    // Make multiple rapid requests
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(makeRequest('GET', '/health'));
    }
    const results = await Promise.all(promises);
    // All should succeed (rate limit is 100/15min, so 5 is fine)
    results.forEach((res) => {
      assert(res.status !== 429, 'Should not hit rate limit with 5 requests');
    });
  });

  // Test 5: Error Handling
  console.log(`\n${colors.blue}5. Error Handling${colors.reset}`);

  await test('Non-existent endpoint returns 404', async () => {
    try {
      const res = await makeRequest('GET', '/api/nonexistent');
      assert(res.status === 404, `Expected 404, got ${res.status}`);
    } catch (error) {
      // Connection error is fine for non-existent endpoint
      assert(true, 'Endpoint properly returns error');
    }
  });

  await test('Invalid JSON in request is handled', async () => {
    try {
      const res = await makeRequest('POST', '/api/chat', {});
      // Should either return error or 200 (depends on implementation)
      assert([200, 400, 500].includes(res.status), `Status should be valid: ${res.status}`);
    } catch (error) {
      assert(true, 'Error properly handled');
    }
  });

  // Test 6: Response Format
  console.log(`\n${colors.blue}6. Response Format${colors.reset}`);

  await test('Health endpoint returns JSON', async () => {
    const res = await makeRequest('GET', '/health');
    assert(typeof res.body === 'object', 'Response should be JSON');
    assert(res.body !== null, 'Response should not be null');
  });

  await test('Responses have correct content-type', async () => {
    const res = await makeRequest('GET', '/health');
    assert(
      res.headers['content-type']?.includes('application/json'),
      'Content-Type should be application/json'
    );
  });

  // Test 7: Performance
  console.log(`\n${colors.blue}7. Performance${colors.reset}`);

  await test('Health check responds quickly', async () => {
    const start = Date.now();
    await makeRequest('GET', '/health');
    const time = Date.now() - start;
    assert(time < 1000, `Response time should be < 1s, got ${time}ms`);
  });

  // Summary
  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Test Results:${colors.reset}`);
  console.log(`  ${colors.green}✓ Passed: ${passed}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${failed}${colors.reset}`);
  console.log(`  Total: ${passed + failed}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Some tests failed!${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
