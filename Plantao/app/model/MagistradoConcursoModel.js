Ext.define('Plantao.model.MagistradoConcursoModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
		{name: 'id', type: 'integer'},
        {name: 'nome', type: 'string'},
		{name: 'matricula', type:'string'},
		{name: 'prioridade', type: 'integer'}
    ]
});