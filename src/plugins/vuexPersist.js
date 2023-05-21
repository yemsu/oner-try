import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key:'onertryVuexStore',
    storage: window.sessionStorage,
    reducer: (state) => ({
      items: state.item.items,
      heroes: state.item.heroes,
      etcItems: state.item.etcItems,
      colleagues: state.item.colleagues,
      equipments: state.item.equipments,
      ships: state.item.ships,
      ships_table: state.item.ships_table,
      synergies: state.item.synergies,
      sailors_synergy: state.item.sailors_synergy,
      chatRoomTypes: state.party.roomTypes,
    })
  }).plugin(store);
}