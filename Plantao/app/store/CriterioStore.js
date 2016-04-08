Ext.define('Plantao.store.CriterioStore', {
    extend: 'Ext.data.Store',
    alias: 'store.criteriostore',
    model: 'Plantao.model.CriterioModel',
    pageSize: 30,
    data: [
    ],
    proxy:{
        type: 'memory',
        reader: {typeProperty: 'array', rootProperty: 'data', totalProperty: 'total'}
    },
    sorters: [{property: 'ranking', direction: 'ASC'}],
    listeners: {
        beforeload: function(store, operation, eOpts) {
            var gridAdm = Ext.ComponentQuery.query('#gridAdministracao')[0];
            var record = gridAdm.getSelectionModel().getSelection()[0];
            var concursoId = record.get('concursoId');
            var pagina = operation.config.page;
            var limit = operation.config.limit;
        
        
/*            var gridSetores = Ext.getCmp('viewCriterio');
            if(gridSetores) {
                gridSetores.getEl().mask('Recuperando classificações...');
            }
*/            
            Plantao.util.JsonPUtil.executaChamada(
                'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/listaCriterioRemocaoPaginado/'+concursoId + '/' + pagina + '/' + limit,
                null,
                {executaChamadaSuccess : function(result, obj){
/*                    if(gridSetores) {
                        gridSetores.getEl().unmask();
                    }
*/
                    
                    var info = result.infoRetornoOficiaisJustica;
                    var interesses = info.criterios;
                    var total = info.quantidade;
                    
//                    var grid = Ext.ComponentQuery.query('#gridCriterio')[0];
//                    var gridStore = grid.getStore();
//                    gridStore.removeAll();
                    var dados = [];
                    Ext.Array.each(interesses, function(interesse, idx){
                        var row = [
                            interesse.ranking,
                            interesse.matricula,
                            interesse.nome,
                            interesse.localizacao,
                            interesse.dtNascimento,
                            interesse.criterio1,
                            interesse.criterio2,
                            interesse.criterio3,
                            interesse.criterio4,
                            interesse.criterio5,
                            interesse.ascensao,
                            interesse.dtPosse,
                            interesse.qtdDiasPosse,
                            interesse.dtInicioAtividade,
                            interesse.qtdDiasCargo,
                            interesse.qtdDiasAtividade,
                            interesse.qtdDiasAntesIngresso,
                            interesse.qtdPercentAqt,
                            interesse.dtSituacaoFuncional,
                            interesse.descSituacaoFuncional,
                            interesse.dtConsulta
                        ];
                        dados.push(row);
//                        gridStore.add(row);                
                    });
                    
                    store.proxy.data = {data: dados, total: total};
                    store.commitChanges();
                    store.load();
                    
                }, executaChamadaError: function(obj){
/*                    if(gridSetores) {
                        gridSetores.getEl().unmask();
                    }
*/
                    Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                }
            });          
        }
    }
    
});