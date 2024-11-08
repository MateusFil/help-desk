import Cookies from 'js-cookie';

export const state = () => ({
  user: null,
  token: null,
});

export const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  LOGOUT(state) {
    state.user = null;
    state.token = null;
  }
};

export const actions = {
  // Essa ação será chamada automaticamente quando a página for carregada
  async nuxtServerInit({ commit }) {
    // Verificar no client-side se há cookies ou localStorage
    if (process.client) {
      const userLoggedIn = Cookies.get('user_logged_in');
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (userLoggedIn && user && token) {
        // Se estiver logado, restaura o estado do usuário e token
        commit('SET_USER', JSON.parse(user)); // Converte o usuário de volta para um objeto
        commit('SET_TOKEN', token); // Restaura o token
      }
    }
  },

  async login({ commit }, user) {
    // Salve o cookie e localStorage
    if (process.client) {
      const sessionTimeoutInMinutes = 60; // Tempo de expiração em minutos (1 hora)

      // Definir o cookie para expirar em 1 hora
      const expireTime = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hora a partir de agora

      // Salvar o cookie com as configurações de segurança
      Cookies.set('user_logged_in', 'true', {
        expires: expireTime,
        secure: process.env.NODE_ENV === 'production', // 'secure' assegura que o cookie só seja enviado via HTTPS
        sameSite: 'Strict', // 'Strict' para maior segurança
        httpOnly: true, // 'httpOnly' evita que o cookie seja acessado via JavaScript
      });

      // Salve o usuário e token no localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
    }

    commit('SET_USER', user);
    commit('SET_TOKEN', user.token);
  },

  logout({ commit }) {
    if (process.client) {
      // Limpar cookies e localStorage ao deslogar
      Cookies.remove('user_logged_in', { secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    commit('LOGOUT');
    // Forçar o recarregamento da página
    location.reload(); // Recarrega a página e limpa o estado
  }
};
