// middleware/auth.js

export default function ({ store, redirect, route }) {
  const user = store.state.user;

  // Páginas que não precisam de autenticação
  const publicPages = ['/', '/login'];

  // Verifica se a página é pública ou não
  const isPublicPage = publicPages.includes(route.path);

  // Se o usuário não estiver logado e a página não for pública, redireciona para o login
  if (!user && !isPublicPage) {
    return redirect('/login');
  }
}
