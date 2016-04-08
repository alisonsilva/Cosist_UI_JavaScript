Ext.define('Oficiais.view.resultado.ResultadoSorteioController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.resultadosorteiocontroller',
    requires: [
        'Ext.window.Window'    
    ],
    
    onRowClick : function() {
    },
        
    onRender : function(view) {
        var gridSetores = Ext.getCmp('viewResultadoSorteio');
        if(gridSetores) {
            gridSetores.getEl().mask('Recuperando resultado...');
        }
        
        var gridSorteio = Ext.ComponentQuery.query('#gridSorteio')[0];
        var record = null;
        if(gridSorteio) {
            record = gridSorteio.getSelectionModel().getSelection()[0];
        }
        
        if(record) {
            var sorteioId = record.get('sorteioId');
            Oficiais.util.JsonPUtil.executaChamada(
                'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/sorteioPorId/'+sorteioId,
                null,
                {executaChamadaSuccess : function(result, obj){
                    if(gridSetores) {
                        gridSetores.getEl().unmask();
                    }
                    var info = result.infoRetornoOficiaisJustica;
                    var sorteio = info.sorteio;
                    var participantes = sorteio.participantes;

                    var grid = Ext.ComponentQuery.query('#gridResultadoSorteio')[0];
                    var gridStore = grid.getStore();
                    gridStore.removeAll();    
                    
                    Ext.Array.each(participantes, function(participante, idx){
                        var row = {setorKey: participante.setorKey, 
                                   oficialJusticaId: participante.oficialJusticaId, 
                                   sorteioId: participante.sorteioId,
                                   nomeOficial: participante.nomeOficial,
                                   matriculaOficial: participante.matriculaOficial,
                                   nomeSetor: participante.nomeSetor,
								   classificacao: participante.classificacao,
								   circunscricaoAtual: participante.circunscricaoOrigem,
								   setorAtual: participante.setorOrigem,
                                   nomeCircunscricao: participante.nomeCircunscricao};
                        gridStore.add(row);                
                    });

                }, executaChamadaError: function(obj){
                    if(gridSetores) {
                        gridSetores.getEl().unmask();
                    }
                    Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                }
            });
        } else {
            Oficiais.util.JsonPUtil.executaChamada(
                'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/sorteioPublicadoUltimoConcurso',
                null,
                {executaChamadaSuccess : function(result, obj){
                    if(gridSetores) {
                        gridSetores.getEl().unmask();
                    }
                    var info = result.infoRetornoOficiaisJustica;
                    var sorteio = info.sorteio;
                    var participantes = sorteio.participantes;

                    var grid = Ext.ComponentQuery.query('#gridResultadoSorteio')[0];
                    var gridStore = grid.getStore();
                    gridStore.removeAll();    
                    
                    Ext.Array.each(participantes, function(participante, idx){
                        var row = {setorKey: participante.setorKey, 
                                   oficialJusticaId: participante.oficialJusticaId, 
                                   sorteioId: participante.sorteioId,
                                   nomeOficial: participante.nomeOficial,
                                   matriculaOficial: participante.matriculaOficial,
                                   nomeSetor: participante.nomeSetor,
                                   nomeCircunscricao: participante.nomeCircunscricao,
								   circunscricaoAtual: participante.circunscricaoOrigem,
								   setorAtual: participante.setorOrigem,
								   classificacao: participante.classificacao};
                        gridStore.add(row);                
                    });

                }, executaChamadaError: function(obj){
                    if(gridSetores) {
                        gridSetores.getEl().unmask();
                    }
                    Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                }
            });
        }
    }
  
});