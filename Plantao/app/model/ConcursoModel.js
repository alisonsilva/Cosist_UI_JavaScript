Ext.define('Plantao.model.ConcursoModel', {
    extend: 'Ext.data.Model',
    idProperty: 'concurso_id',
    fields: [
        {name: 'concurso_id', type: 'integer'},
        {name: 'dh_ini_concurso', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'dh_fim_concurso', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'id_recusa', type: 'integer'},
        {name: 'id_escala', type: 'integer'},
        {name: 'dh_inicio_escala', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'dh_fim_escala', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'id_modalidade', type: 'integer'},
		{name: 'desc_modalidade', type: 'string'},
		{name: 'id_magistrado', type: 'integer'},
		{name: 'nome_magistrado', type: 'string'},
		{name: 'matricula_magistrado', type: 'string'}
    ]
});