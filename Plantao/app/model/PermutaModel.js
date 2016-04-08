Ext.define('Plantao.model.PermutaModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id_permuta',
    fields: [
        {name: 'id_permuta', type: 'integer'},
        {name: 'id_escala', type: 'integer'},
        {name: 'dh_inicio_escala', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'dh_fim_escala', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'id_modalidade_escala', type: 'integer'},
		{name: 'desc_modalidade_escala', type: 'string'},
		{name: 'id_magistrado_escala', type: 'integer'},
		{name: 'nome_magistrado_escala', type: 'string'},
		{name: 'matricula_magistrado_escala', type: 'string'},
		{name: 'id_magistrado_confirmacao', type: 'integer'},
		{name: 'fl_confirmacao', type: 'bool'}
    ]
});