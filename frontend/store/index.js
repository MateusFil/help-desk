export const state = () => ({
  user: null,
  token: null,
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  LOGOUT(state) {
    state.user = null
    state.token = null
  }
}

export const actions = {
  async logout({ commit }) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado.');
      }


      await this.$axios.$post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.clear();
      // Limpar estado
      await commit('LOGOUT');
      localStorage.removeItem('token');
      
      
      // Redirecionar para a tela de login
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  },
}
