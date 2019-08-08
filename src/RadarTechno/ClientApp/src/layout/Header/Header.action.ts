export const onLogout = (localStorage: Storage) => {
  localStorage.removeItem('token');
};
