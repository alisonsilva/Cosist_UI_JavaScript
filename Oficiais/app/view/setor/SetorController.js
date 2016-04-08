Ext.define('Oficiais.view.setor.SetorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.setorcontroller',
    requires: [
        'Ext.window.Window'    
    ],

    onRowClick: function(grid, record, tr, rowIndex, e, options) {
        var grid = Ext.ComponentQuery.query('#gridSetor')[0];
        var record = grid.getSelectionModel().getSelection()[0];
        if(!record) {
            return;
        }
        var setorKey = record.get('id');
        var win2 = Ext.create('Ext.window.Window', {
            height: 400,
            width: 950,
            x: 200,
            y: 100,
            title: 'Setores',
            closable: true,
            plain: true,
            layout: 'fit',
            items: [{
                region: 'center',
                xtype: 'gridpanel',
                itemId: 'gridOficiais',
                store: 'OficialStore',
                title: 'Oficiais com reserva',
                viewConfig: {
                    enableTextSelection: false,
                    listeners: {
                        render: function( view, eOpts ) {
                            var concursoId = localStorage.getItem("concursoId");
                            Oficiais.util.JsonPUtil.executaChamada(
                                'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/oficiaisPorSetor/' + setorKey + '/' + concursoId,
                                null,
                                {executaChamadaSuccess : function(result, obj){
                                    var info = result.infoRetornoOficiaisJustica;
                                    var setores = info.interesses;

                                    var grid = Ext.ComponentQuery.query('#gridOficiais')[0];
                                    var gridStore = grid.getStore();
                                    gridStore.removeAll();
                                    
                                    Ext.Array.each(setores, function(setor, idx){
                                        var row = {matricula: setor.matriculaOficial, 
                                                   nome: setor.nomeOficial, 
                                                   preferencia: setor.prioridade,
                                                   ranking: setor.ranking};
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
                        text     : 'Matrícula',
                        width    : 100,
                        dataIndex: 'matricula'
                    },
                    {
                        text     : 'Nome',
                        flex: 1,
                        sortable : true,
                        dataIndex: 'nome'
                    },
                    {
                        text: 'Preferência',
                        width: 120,
                        dataIndex: 'preferencia'
                    },
                    {
                        text: 'Classficação',
                        width: 120,
                        dataIndex: 'ranking'
                    }
                ]
            }]
        });
        win2.show();
    }    
   
});