Ext.define('Oficiais.store.ResultadoSorteioStore', {
    extend: 'Ext.data.Store',
    alias: 'store.resultadosorteiostore',
    model: 'Oficiais.model.ResultadoSorteioModel',
    data: [
    ],
    sorters: {property: 'nomeCircunscricao', direction: 'ASC'}
    
});