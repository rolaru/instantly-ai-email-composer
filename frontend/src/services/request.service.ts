/**
 * Generic AJAX request wrapper
 *
 * A facade over the built-in fetch API offering simplified calls for
 * GET, POST, PUT and DELETE requests.
 *
 * NOTE: It was done on purpose as a service and not as a React hook
 * in order to avoid the issues that would have arised from hooks
 * needing to be called at the top of the component function. This
 * would have limited us to only one hook call and no posibility to
 * do requests inside useEffect() or any other functions.
 */

type RequestMethods =
  | 'GET'
  | 'get'
  | 'POST'
  | 'post'
  | 'PUT'
  | 'put'
  | 'DELETE'
  | 'delete';

interface RequestOptions extends Partial<RequestInit> {
  headers?: Record<string, string>;
}

export default async function doRequest(
  url: string,
  method: RequestMethods = 'GET',
  body: Object = null,
  options: RequestOptions = {}
) {
  if (!url) {
    throw new Error('Missing mandatory parameter: "url".');
  }

  const requestParams = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  };

  if (body && method?.toUpperCase() !== 'GET') {
    requestParams.body = JSON.stringify(body);
  }

  const base = process.env.NEXT_PUBLIC_APIS_URL || '';
  url = url?.startsWith('http') ? url : base + url;
  const response = await fetch(url, requestParams);
  return {
    data: await response.json(),
    status: response.status
  }
}

export function doGetRequest(url: string, options?: RequestOptions) {
  return doRequest(url, 'GET', null, options);
}

export function doPostRequest(
  url: string,
  body: Object,
  options?: RequestOptions
) {
  return doRequest(url, 'POST', body, options);
}

export function doPutRequest(
  url: string,
  body: Object,
  options?: RequestOptions
) {
  return doRequest(url, 'PUT', body, options);
}

export function doDeleteRequest(
  url: string,
  body?: Object,
  options?: RequestOptions
) {
  return doRequest(url, 'DELETE', body, options);
}
