import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key:'onertryVuexStore',
    reducer: (state) => ({
      items: state.items,
      heroes: state.heroes,
      etcItems: state.etcItems,
      colleagues: state.colleagues,
      equipments: state.equipments,
    })
  }).plugin(store);
}