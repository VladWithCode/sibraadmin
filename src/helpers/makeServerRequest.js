import { staticURL } from '../url';

export default async function makeServerRequest(
  api,
  method = 'GET',
  body,
  headers
) {
  const fetchOpts = {
    // credentials: 'include',
    // mode: 'cors',
    method,
  };

  if (body) fetchOpts.body = transformBody(body);
  if (headers) fetchOpts.headers = headers;

  try {
    const res = await fetch(staticURL + api, fetchOpts);

    return await res.json();
  } catch (err) {
    console.log(err);
    return err;
  }

  function transformBody(o) {
    if (o instanceof FormData) return o;
    if (typeof o !== 'object') return o;

    return JSON.stringify(o);
  }
}
