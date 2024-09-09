// middleware/auth.js

export default function ({ store, redirect }) {
    const user = store.state.user;
  
    // Se o usuário não estiver logado, redireciona para a página de login
    if (!user) {
      return redirect('/login');
    }
  }
  