import test from "enhanced-tape";
import fetchMock from "fetch-mock";
import { rejectIf, addRequestOptions, transformResponse, transformRequestBody } from "improve_fetch";

function mockFetch() {
  return fetchMock.sandbox().once(...arguments);
}

test("improve-fetch", function(t) {
  t.test("rejectIf", function(t) {
    t.test("rejects with response if check() returned true", async function(t) {
      let fetch = mockFetch("test.com", 404);
      fetch = rejectIf(() => true, fetch);

      let rejected = await fetch("test.com").then(() => false, (r) => r);
      t.true(rejected);
      t.equal(rejected.status, 404);

      t.end();
    });

    t.test("resolves with response if check() returned false", async function(t) {
      let fetch = mockFetch("test.com", 200);
      fetch = rejectIf(() => false, fetch);

      let processed = await fetch("test.com").then((r) => r, () => false);
      t.true(processed);
      t.equal(processed.status, 200);

      t.end();
    });

    t.test("passes response to check()", async function(t) {
      let fetch = mockFetch("test.com", {hi: "hello"});
      fetch = rejectIf((r) => r.status !== 200, fetch);

      let response = await fetch("test.com").then(r => r.json());
      t.same(response, {hi: "hello"});

      t.end();
    });
  });

  t.test("addRequestOptions", function(t) {
    t.test("adds provided options to request options", async function(t) {
      let fetch = mockFetch("test.com", 200, {method: "POST"});
      fetch = addRequestOptions({method: "POST"}, fetch);

      let response = await fetch("test.com");
      t.equal(response.status, 200);
  
      t.end();
    });

    t.test("makes provided options overwritable", async function(t) {
      let fetch = mockFetch("test.com", 200, {method: "PUT"});
      fetch = addRequestOptions({method: "POST"}, fetch);

      let response = await fetch("test.com", {method: "PUT"});
      t.equal(response.status, 200);
    
      t.end();
    });

    t.test("merges headers into request headers", async function(t) {
      let expectedHeaders = {"Accepts": "text/json", 'Content-Type': 'application/json'};
      let fetch = mockFetch("test.com", 200, {headers: expectedHeaders});
      fetch = addRequestOptions({headers: {"Accepts": "text/json"}}, fetch);

      let response = await fetch("test.com", {headers: {"Content-Type": "application/json"}});
      t.equal(response.status, 200);
    
      t.end();
    });

    t.test("makes provided headers overwritable", async function(t) {
      let fetch = mockFetch("test.com", 200, {headers: {"Accepts": "application/json"}});
      fetch = addRequestOptions({headers: {"Accepts": "test/html"}}, fetch);

      let response = await fetch("test.com", {headers: {"Accepts": "application/json"}});
      t.equal(response.status, 200);
    
      t.end();
    });
  });

  t.test("transformResponse", function(t) {
    t.test("transforms response", async function(t) {
      let fetch = mockFetch("test.com", {a: 1});
      fetch = transformResponse((r) => r.json(), fetch);

      let response = await fetch("test.com");
      t.same(response, {a: 1});
  
      t.end();
    });
  });

  t.test("transformRequestBody", async function(t) {
    t.test("transforms request body", async function(t) {
      let fetch = mockFetch("test.com", 200, {body: {a: 1}, method: "POST"});
      fetch = transformRequestBody(JSON.stringify, fetch);

      let response = await fetch("test.com", {body: {a: 1}, method: "POST"});
      t.equal(response.status, 200);

      t.end();
    });

    t.test("doesn't transform if opts are undefined", async function(t) {
      let fetch = mockFetch("test.com", 200);
      fetch = transformRequestBody(() => { throw new Error("shouldn't transform"); }, fetch);

      let response = await fetch("test.com");
      t.equal(response.status, 200);
    
      t.end();
    });

    t.test("doesn't transform if request has no body", async function(t) {
      let fetch = mockFetch("test.com", 200);
      fetch = transformRequestBody(() => { throw new Error("shouldn't transform"); }, fetch);

      let response = await fetch("test.com", {});
      t.equal(response.status, 200);
    
      t.end();
    });
  });
});