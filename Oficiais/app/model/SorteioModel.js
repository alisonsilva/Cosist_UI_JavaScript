Ext.define('Oficiais.model.SorteioModel', {
    extend: 'Ext.data.Model',
    idProperty: 'sorteioId',
    fields: [
        {name: 'sorteioId', type: 'integer'},
        {name: 'concursoId', type: 'integer'},
        {name: 'matriculaUsuario', type: 'string'},
        {name: 'nomeUsuario', type: 'string'},
        {name: 'dhSorteio', type: 'date', dateFormat: 'd/m/Y H:i:s'},
        {name: 'flValido', type: 'bool'},
        {name: 'flPublicado', type:'bool'}
    ]
});