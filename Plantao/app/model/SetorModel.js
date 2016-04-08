Ext.define('Plantao.model.SetorModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'nome', type: 'string'},
        {name: 'descricao', type: 'string'},
        {name: 'data', type: 'date', dateFormat: 'd/m/Y H:i:s'},
		{name: 'flAtivo', type: 'bool'},
		{name: 'flPublicado', type: 'bool'},
        {name: 'id', type: 'integer'}
    ]
});