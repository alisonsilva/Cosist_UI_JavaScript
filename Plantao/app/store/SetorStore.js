Ext.define('Plantao.store.SetorStore', {
    extend: 'Ext.data.Store',
    alias: 'store.setorstore',
    model: 'Plantao.model.ReservaModel',
    data: [
    ],
    sorters: {property: 'descricao', direction: 'ASC'},
    groupField: 'circunscricao'
    
});