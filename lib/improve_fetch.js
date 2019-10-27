export function rejectIf(isInvalidResponse, oldFetch) {
  return function fetch() {
    return oldFetch(...arguments).then(r => {
      if (isInvalidResponse(r)) {
        return Promise.reject(r);
      } else {
        return r;
      }
    });
  };
}

export function addRequestOptions(addedOptions, oldFetch) {
  return function fetch(resource, options={}) {
    let headers = Object.assign({}, addedOptions.headers, options.headers);
    let mergedOptions = Object.assign({}, addedOptions, options, { headers });

    return oldFetch(resource, mergedOptions);
  };
}

export function transformRequestBody(transform, oldFetch) {
  return function fetch(resource, options) {
    if (options && hasKey(options, "body")) {
      let body = transform(options.body);
      options = Object.assign({}, options, { body });
    }

    return oldFetch(resource, options);
  };
}

export function transformResponse(transform, oldFetch) {
  return function fetch() {
    return oldFetch(...arguments).then(transform);
  };
}

function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}