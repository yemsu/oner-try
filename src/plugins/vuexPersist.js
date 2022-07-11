import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key:'onertryVuexStore',
    storage: window.sessionStorage,
    reducer: (state) => ({
      items: state.items,
      heroes: state.heroes,
      etcItems: state.etcItems,
      colleagues: state.colleagues,
      equipments: state.equipments,
      synergies: state.synergies,
    })
  }).plugin(store);
}