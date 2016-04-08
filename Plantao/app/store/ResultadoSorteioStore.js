Ext.define('Plantao.store.ResultadoSorteioStore', {
    extend: 'Ext.data.Store',
    alias: 'store.resultadosorteiostore',
    model: 'Plantao.model.ResultadoSorteioModel',
    data: [
    ],
    sorters: {property: 'nomeCircunscricao', direction: 'ASC'}
    
});