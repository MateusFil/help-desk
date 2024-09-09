// middleware/admin.js

export default function ({ store, redirect }) {
    const user = store.state.user;
  
    // Se o usuário não for admin (tipo 1), redireciona para o dashboard do usuário
    if (user && user.tipo !== 1) {
      return redirect('/dashboard_user');
    }
  }
  