Ext.define('Oficiais.view.reserva.ReservaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reservacontroller',
    requires: [
        'Ext.window.Window'    
    ],

    onReservaClick: function() {
        var me = this;
        var win2 = Ext.create('Ext.window.Window', {
            height: 720,
            width: 1200,
            x: 50,
            y: 50,
            title: 'Setores',
            closable: true,
            plain: true,
            modal: true,
            layout: 'fit',
            items: [{
                region: 'center',
                xtype: 'gridpanel',
                itemId: 'gridEscolhaSetores',
                store: 'SetorEscolhaStore',
                title: 'Escolha o setor desejado',
                viewConfig: {
                    enableTextSelection: false,
                    listeners: {
                        render: function( view, eOpts ) {
                            var concursoId = localStorage.getItem("concursoId");
                            Oficiais.util.JsonPUtil.executaChamada(
                                'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/listaSetores/'+concursoId,
                                null,
                                {executaChamadaSuccess : function(result, obj){
                                    var info = result.infoRetornoOficiaisJustica;
                                    var setores = info.setores;

                                    var grid = Ext.ComponentQuery.query('#gridEscolhaSetores')[0];
                                    var gridStore = grid.getStore();
                                    gridStore.removeAll();
                                    
                                    Ext.Array.each(setores, function(setor, idx){
                                        var row = {circunscricao: setor.nomeCircunscricao, 
                                                   descricao: setor.nomeSetor, 
                                                   qtd_disponivel: setor.qtdOficiaisALotar,
                                                   qtd_reservas: setor.qtdReservas,
                                                   preferencia: setor.preferencia,
                                                   id: setor.setorKey};
                                        gridStore.add(row);                
                                    });
                                }, executaChamadaError: function(obj){
                                    Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                                }
                            });                
                        }
                    }
                },
                items: [],
                        
                columns: [
                    {
                        text     : 'Circunscrição',
                        flex     : 1,
                        sortable : true,
                        dataIndex: 'circunscricao'
                    },
                    {
                        text     : 'Descricao',
                        flex: 1,
                        sortable : true,
                        dataIndex: 'descricao'
                    },
                    {
                        text: 'Disponível(is)',
                        width: 100,
                        sortable: true,
                        dataIndex: 'qtd_disponivel'
                    },
                    {
                        text: 'Pedidos',
                        width: 80,
                        sortable: true,
                        dataIndex: 'qtd_reservas'
                    }
                ],
                
                listeners: {
                    selectionchange: function (view, selections, options) {
                        var record = selections[0];
                        if(!record) {
                            return;
                        }
                        var setorKey = record.get('id');
                        
                        var matricula = localStorage.getItem('matricula');
                        var obj = {matriculaOficial: matricula, setorKey: setorKey, concursoId: localStorage.getItem("concursoId")};                        
                        Oficiais.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/novoInteresse'
                                    , obj, null, {executaChamadaSuccess : function(result, obj){
                                        var info = result.infoRetornoOficiaisJustica;
                                        var codigo = info.codigo;
                                        if(codigo == 0) {
                                            Oficiais.util.DeviceUtil.showAlertaConfirma('Info', 'Reserva cadastrada com sucesso', Ext.Msg.MESSAGE, function(){
                                                Oficiais.util.JsonPUtil.executaChamada(
                                                    'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/interessesPorMatricula/' 
                                                            + matricula + '/' + localStorage.getItem("concursoId"),
                                                    null,
                                                    {executaChamadaSuccess : function(result, obj){
                                                        var info = result.infoRetornoOficiaisJustica;
                                                        var setores = info.interesses;

                                                        var grid = Ext.ComponentQuery.query('#gridReserva')[0];
                                                        var gridStore = grid.getStore();
                                                        gridStore.removeAll();
                                                        
                                                        Ext.Array.each(setores, function(setor, idx){
                                                            var row = {circunscricao: setor.nomeCircunscricao, 
                                                                       descricao: setor.nomeSetor, 
                                                                       qtd_disponivel: setor.qtdOficiaisALotar,
                                                                       qtd_reservas: setor.qtdReservas,
                                                                       preferencia: setor.prioridade,
                                                                       id: setor.setorKey};
                                                            gridStore.add(row);                
                                                        });
                                                        win2.close(); 
                                                        me.onRefreshListSetores();                                                        
                                                    }, executaChamadaError: function(obj){
                                                        Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                                                    }
                                                });                                                                             
                                            });
                                        } else {
                                            Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao cadastrar reserva: ' + info.mensagem, Ext.Msg.ERROR, function(){});
                                        }
                                    }, executaChamadaError: function(obj){
                                    }});
                    }
                }
            }]
        });
        win2.show();
    },
    
    onRemoveReservaClick : function() {
        var me = this;
        var userGrid = Ext.ComponentQuery.query('#gridReserva')[0];
        var matricula = localStorage.getItem('matricula');
        if (userGrid.getSelectionModel().hasSelection()) {
           var row = userGrid.getSelectionModel().getSelection()[0];
           var setorKey = row.get('id');
           var interesse = {matriculaOficial: matricula, setorKey: setorKey, concursoId:localStorage.getItem("concursoId")};
            Oficiais.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja apagar a reserva?', Ext.Msg.QUESTION, function(){
                Oficiais.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/removeInteresse'
                            , interesse, null, {executaChamadaSuccess : function(result, obj){
                                var info = result.infoRetornoOficiaisJustica;
                                var codigo = info.codigo;
                                var mensagem = info.mensagem;
                                var setores = info.interesses;
                                if(codigo == 0) {
                                    var grid = Ext.ComponentQuery.query('#gridReserva')[0];
                                    var gridStore = grid.getStore();
                                    gridStore.removeAll();
                                    
                                    Ext.Array.each(setores, function(setor, idx){
                                        var row = {circunscricao: setor.nomeCircunscricao, 
                                                   descricao: setor.nomeSetor, 
                                                   qtd_disponivel: setor.qtdOficiaisALotar,
                                                   qtd_reservas: setor.qtdReservas,
                                                   preferencia: setor.prioridade,
                                                   id: setor.setorKey};
                                        gridStore.add(row);                
                                    });
                                    me.onRefreshListSetores();
                                    Oficiais.util.DeviceUtil.showAlertaConfirma('Info', 'Reserva removida com sucesso', Ext.Msg.INFO, function(){});
                                } else {
                                    Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada: ' + mensagem, Ext.Msg.ERROR, function(){});
                                }
                                
                            }, executaChamadaError : function(){
                                Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});
                            }
                });           
                
            }, function(){
            });
        }    
    },
    
    onRefreshListSetores : function() {
        var gridSetores = Ext.ComponentQuery.query('#gridSetor')[0];
        if(gridSetores && gridSetores.getEl()) {
            gridSetores.getEl().mask();
        }
        var concursoId = localStorage.getItem("concursoId");
        Oficiais.util.JsonPUtil.executaChamada(
            'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/listaSetores/'+concursoId,
            null,
            {executaChamadaSuccess : function(result, obj){
                if(gridSetores && gridSetores.getEl() ) {
                    gridSetores.getEl().unmask();
                }
                var info = result.infoRetornoOficiaisJustica;
                var setores = info.setores;

                var grid = Ext.ComponentQuery.query('#gridSetor')[0];
                var gridStore = grid.getStore();
                gridStore.removeAll();
                
                Ext.Array.each(setores, function(setor, idx){
                    var row = {circunscricao: setor.nomeCircunscricao, 
                               descricao: setor.nomeSetor, 
                               qtd_disponivel: setor.qtdOficiaisALotar,
                               qtd_reservas: setor.qtdReservas,
                               id: setor.setorKey};
                    gridStore.add(row);                
                });
                var groupFeature = grid.getView().getFeature('group');
                groupFeature.collapseAll();
                
            }, executaChamadaError: function(obj){
                if(gridSetores && gridSetores.getEl()) {
                    gridSetores.getEl().unmask();
                }
                Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
            }
        });
    },
    
    
    
    moveRowBaixoClick : function() {
        var grid = Ext.ComponentQuery.query('#gridReserva')[0];
        this.moveSelectedRow(grid, 1);
    }, 
    
    moveRowCimaClick : function() {
        var grid = Ext.ComponentQuery.query('#gridReserva')[0];
        this.moveSelectedRow(grid, -1);
    },
    
    moveSelectedRow : function (grid, direction) {
        var record = grid.getSelectionModel().getSelection()[0];
        if (!record) {
            return;
        }
        var index = grid.getStore().indexOf(record);
        if (direction < 0) {
            index--;
            if (index < 0) {
                return;
            }
        } else {
            index++;
            if (index >= grid.getStore().getCount()) {
                return;
            }
        }
        record.set('preferencia', record.get('preferencia') + direction);
        var recordSubs = grid.getStore().getAt(index);
        recordSubs.set('preferencia', recordSubs.get('preferencia') - direction);
        record.commit();
        recordSubs.commit();
        
        grid.getStore().remove(record);
        grid.getStore().insert(index, record);
        grid.getSelectionModel().select(index, true);
        
        var ordemPrioridade = [];
        var matricula = localStorage.getItem('matricula');
        var idx = 0;
        for(idx = 0; idx < grid.getStore().getCount(); idx++) {
            var rec = grid.getStore().getAt(idx);
            var vlrTmp = {prioridade: rec.get('preferencia'), 
                          matriculaOficial: matricula,
                          setorKey: rec.get('id'),
                          concursoId:localStorage.getItem("concursoId")};
            Ext.Array.include(ordemPrioridade, vlrTmp);
        }
        var req = {interesses: ordemPrioridade };
        grid.getEl().mask();
        Oficiais.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/priorizarInteresses'
                    , req, null, {executaChamadaSuccess : function(result, obj){
                        grid.getEl().unmask();
                        var info = result.infoRetornoOficiaisJustica;
                        var codigo = info.codigo;
                        var mensagem = info.mensagem;
                        if(codigo != 0) {
                            Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada: ' + mensagem, Ext.Msg.ERROR, function(){});
                        }
                        
                    }, executaChamadaError : function(){
                        grid.getEl().unmask();
                        Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});
                    }
        });           
        
    }    
});