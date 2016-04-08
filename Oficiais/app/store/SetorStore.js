Ext.define('Oficiais.store.SetorStore', {
    extend: 'Ext.data.Store',
    alias: 'store.setorstore',
    model: 'Oficiais.model.ReservaModel',
    data: [
    ],
    sorters: {property: 'descricao', direction: 'ASC'},
    groupField: 'circunscricao'
    
});