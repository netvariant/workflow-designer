import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getInitialState = () => {
  return {
    appId: process.env.VUE_APP_ID,
    language: 'en',
    userId: null,
    userFullName: null,
    requestPath: null,
    apiKey: null,
    sessionToken: null,
    userAuthenticated: false
  }
}

export default new Vuex.Store({
  state: getInitialState(),
  mutations: {
    setApiKey (state, apiKey) {
      state.apiKey = apiKey
      state.userAuthenticated = apiKey !== null
    },
    setUserId (state, userId) {
      state.userId = userId
    },
    setUserFullName (state, userFullName) {
      state.userFullName = userFullName
    },
    setSessionToken (state, sessionToken) {
      state.sessionToken = sessionToken
    },
    setRequestPath (state, requestPath) {
      state.requestPath = requestPath
    },
    setLanguage (state, language) {
      state.language = language
    }
  },
  actions: {
    setApiKey ({ commit }, payload) {
      commit('setApiKey', payload.apiKey)
    },
    setUserId ({ commit }, payload) {
      commit('setUserId', payload.userId)
    },
    setUserFullName ({ commit }, payload) {
      commit('setUserFullName', payload.userFullName)
    },
    setSessionToken ({ commit }, payload) {
      commit('setSessionToken', payload.sessionToken)
    },
    setRequestPath ({ commit }, payload) {
      commit('setRequestPath', payload.requestPath)
    },
    setLanguage ({ commit }, payload) {
      commit('setLanguage', payload.language)
    },
    resetState ({ commit }, payload) {
      const initialState = getInitialState()
      this.dispatch('setUserId', {
        userId: initialState.userId
      })
      this.dispatch('setUserFullName', {
        userId: initialState.userFullName
      })
      this.dispatch('setRequestPath', {
        userId: initialState.requestPath
      })
      this.dispatch('setApiKey', {
        userId: initialState.apiKey
      })
      this.dispatch('setSessionToken', {
        userId: initialState.sessionToken
      })
      this.dispatch('setLanguage', {
        language: initialState.language
      })
    }
  }
})
