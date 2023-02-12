import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key:'onertryMrpgVuexStore',
    storage: window.sessionStorage,
    reducer: (state) => ({
      equipments: state.mrpg.equipments,
      materials: state.mrpg.materials
    })
  }).plugin(store);
}