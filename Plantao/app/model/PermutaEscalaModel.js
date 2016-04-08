Ext.define('Plantao.model.PermutaEscalaModel', {
    extend: 'Ext.data.Model',
    idProperty: 'escalaId',
    fields: [
        {name: 'escalaId', type: 'integer'},
		{name: 'sorteioId', type: 'integer'},
		{name: 'magistradoId', type: 'integer'},
		{name: 'nomeMagistrado', type: 'string'},
		{name: 'matriculaMagistrado', type: 'string'},
        {name: 'dtInicio', type: 'date', dateFormat: 'd/m/Y H:i:s'},
        {name: 'dtFim', type: 'date', dateFormat: 'd/m/Y H:i:s'},
        {name: 'modalidadeId', type: 'integer'},
		{name: 'descModalidade', type: 'string'},        
        {name: 'flAtivo', type: 'bool'},
		{name: 'flAutomatico', type: 'bool'},
		{name: 'flRecusado', type: 'bool'}
    ]
});