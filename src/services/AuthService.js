import makeServerRequest from '../helpers/makeServerRequest';

class AuthService {
  async signin(username, password) {
    const { status, user, message, error } = await makeServerRequest(
      '/auth',
      'POST',
      { user: username, pass: password },
      { 'Content-Type': 'application/json' }
    );

    if (status !== 'OK' || !user) {
      error && console.log(error);
      return [false, { message, error }];
    }

    return [user];
  }

  async signout() {
    const { status, message, error } = await makeServerRequest(
      '/auth',
      'DELETE'
    );

    if (status !== 'OK') {
      console.log(error);
      return [message, error];
    }

    return [message];
  }
}

export default new AuthService();
