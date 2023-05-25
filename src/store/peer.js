export const state = () => ({
  peer: null,
  connections: [],
  beep: null,
  refreshChecker: `onertrychatroomRefreshflag`,
})

export const getters = {
  getPeer: (state) => state.peer,
  getConnections: (state) => state.connections,
  getBeep: (state) => state.beep,
  getRefreshChecker: (state) => state.refreshChecker,
}

export const mutations = {
  SET_PEER(state, peer) {
    state.peer = peer
  },
  SET_CONNECTIONS(state, connections) {
    state.connections = connections
  },
}

export const actions = {
  CREATE_PEER({ commit }, { $Peer, peerId, onError, onOpen, onConnection }) {
    console.log(11)
    const peer = new $Peer(peerId, {
      host: process.env.PEER_SERVER,
      secure: true
    })
    peer.on('error', onError)
    peer.on('on', onOpen)
    peer.on('connection', onConnection)
    peer.on('disconnected', (connection) => {
      console.log('disconnected!', connection)
    })

    commit('SET_REFRESH_CHECKER', peerId)
    commit('SET_PEER', peer)
  },
}