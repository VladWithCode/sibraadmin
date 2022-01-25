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

  if (body) fetchOpts['body'] = body;
  if (headers) fetchOpts['headers'] = headers;

  try {
    const res = await fetch(staticURL + api, fetchOpts);
    console.log(res);
    return await res.json();
  } catch (err) {
    console.log(err);
    return err;
  }
}
