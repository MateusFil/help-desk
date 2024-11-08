// middleware/auth.js
import Cookies from 'js-cookie';

export default function ({ store, redirect }) {
  const userLoggedIn = Cookies.get('user_logged_in');
  
  // Se o cookie não estiver presente, redireciona para o login
  if (!userLoggedIn) {
    return redirect('/login');
  }

  // Caso o cookie esteja presente, mantém o usuário logado
}
