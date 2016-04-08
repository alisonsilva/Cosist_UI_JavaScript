Ext.define('Plantao.model.MagistradoPermutaModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
		{name: 'id', type: 'integer'},
        {name: 'nome', type: 'string'},
		{name: 'matricula', type:'string'},
		{name: 'prioridade', type: 'integer'},
		{name: 'fl_confirmado', type: 'bool'},
		{name: 'desc_modalidade', type: 'string'},
		{name: 'dt_inicio', type: 'date'},
		{name: 'dt_fim', type: 'date'},
		{name: 'id_escala', type: 'integer'},
		{name: 'id_permuta', type: 'integer'}
    ]
});