Ext.define('Plantao.model.CriterioModel', {
    extend: 'Ext.data.Model',
    idProperty: 'ranking',
    fields: [
        {name: 'ranking', type: 'integer'},
        {name: 'matricula', type: 'string'},
        {name: 'nome', type: 'string'},
        {name: 'localizacao', type: 'string'},
        {name: 'dataNascimento', type: 'date', dateFormat: 'd/m/Y'},
        {name: 'criterio1', type: 'integer'},
        {name: 'criterio2', type:'integer'},
        {name: 'criterio3', type:'integer'},
        {name: 'criterio4', type:'integer'},
        {name: 'criterio5', type:'date', dateFormat: 'd/m/Y'},
        {name: 'ascensao', type:'string'},
        {name: 'dataPosse', type:'date', dateFormat: 'd/m/Y'},
        {name: 'qtdDiasPosse', type:'integer'},
        {name: 'dataInicioAtividade', type:'date', dateFormat: 'd/m/Y'},
        {name: 'qtdDiasCargo', type:'integer'},
        {name: 'qtdDiasAtividade', type:'integer'},
        {name: 'qtdDiasAntesIngresso', type:'integer'},
        {name: 'qtdPercentAqt', type:'integer'},
        {name: 'dataSituacaoFuncional', type:'date', dateFormat: 'd/m/Y'},
        {name: 'descSituacaoFuncional', type:'string'},
        {name: 'dataConsulta', type:'date', dateFormat: 'd/m/Y'}
    ]
});