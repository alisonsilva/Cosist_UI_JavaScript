Ext.define('Oficiais.model.ConcursoModel', {
    extend: 'Ext.data.Model',
    idProperty: 'concursoId',
    fields: [
        {name: 'concursoId', type: 'integer'},
        {name: 'numProcesso', type: 'string'},
        {name: 'qtdVagas', type: 'integer'},
        {name: 'dtIniInscricao', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'dtFimInscricao', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'dtResultadoProvisorio', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'dtEncerramento', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'flConcursoValido', type: 'bool'}
    ]
});