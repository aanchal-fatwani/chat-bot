/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      if (sessionStorage) sessionStorage.setItem('user', JSON.stringify({ email, isLoggedIn:true }));
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    if(err.res)
    showAlert('error', err.res.data.message);
  }
};
export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User signup successful!');
      if (sessionStorage) sessionStorage.setItem('user', JSON.stringify({ name, email, isLoggedIn:true }));
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    if(err.response)
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
export const loginUserDetails = () => {
  let user = {};
  if (sessionStorage && sessionStorage.getItem('user')) {
    user = JSON.parse(sessionStorage.getItem('user'));
  }
  return user;
};
export const handleLoginStatusHeader = () => {
  let { name, email, isLoggedIn } = loginUserDetails();
  let loginEl = document.querySelector('#nav_login');
  let signupEl = document.querySelector('#nav_signup');
  if (isLoggedIn && email) {
    loginEl.innerHTML = `Hi ${name ? name : 'User'}`;
    loginEl.href = '';
    signupEl.innerHTML = 'Log Out';
    signupEl.addEventListener('click', () => {
      sessionStorage && sessionStorage.removeItem('user');
    });
    signupEl.href = '';
  } else {
    loginEl.innerHTML = 'Log In';
    loginEl.href = '/login';
    signupEl.innerHTML = 'Sign Up';
    signupEl.href = '/signup';
  }
};

export const handleLoginSignUp = () => {
  const loginForm = document.querySelector('.form--login');

  if (loginForm) {
    document.getElementById('email').value = loginUserDetails().email || '';

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (
        document.getElementById('name') &&
        document.getElementById('passwordConfirm')
      ) {
        const name = document.getElementById('name').value;
        const passwordConfirm = document.getElementById('passwordConfirm')
          .value;
        signUp(name, email, password, passwordConfirm);
      } else {
        login(email, password);
      }
    });
  }
};

