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
      Cookies.set('user_logged_in', 'true', { expires: 7 }); // Cookie para manter o login por 7 dias
      localStorage.setItem('user', JSON.stringify(user)); // Salve o usuário no localStorage
      localStorage.setItem('token', user.token); // Salve o token no localStorage
    }

    commit('SET_USER', user);
    commit('SET_TOKEN', user.token);
  },

  logout({ commit }) {
    if (process.client) {
      // Limpar cookies e localStorage ao deslogar
      Cookies.remove('user_logged_in');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    commit('LOGOUT');
  }
};
