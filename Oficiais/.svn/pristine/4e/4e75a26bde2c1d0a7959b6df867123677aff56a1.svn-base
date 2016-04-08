Ext.define('Oficiais.view.setor.Setor', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Oficiais.view.main.MainController',
        'Oficiais.view.main.MainModel',
        'Oficiais.view.setor.SetorController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Oficiais.util.DeviceUtil',
        'Oficiais.util.JsonPUtil',
        'Ext.tip.QuickTipManager'
    ],

    xtype: 'setor-grid',
    controller: 'setorcontroller',
    title: 'Setores disponíveis',
    tooltip: 'Visualize os setores disponíveis e quem registrou interesse',
    id: 'viewSetores',
    
    layout: {
        type: 'border'
    },
    height: 650,
    items: [{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridSetor',
        store: 'SetorStore',
        multiSelect: false,
        frame: false,
        stateId: 'setorGrid',
        height: 650,
        width: 750,
        title: 'Setores disponíveis - clique no setor para ver os candidatos',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
                render: function(view) {
                    var concursoId = localStorage.getItem("concursoId");
                    matricula = localStorage.getItem("matricula");
                    var gridSetores = Ext.getCmp('viewSetores');
                    if(gridSetores) {
                        gridSetores.getEl().mask('Recuperando setores...');
                    }
                    Oficiais.util.JsonPUtil.executaChamada(
                        'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/listaSetores/'+concursoId,
                        null,
                        {executaChamadaSuccess : function(result, obj){
                            if(gridSetores) {
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
                            if(gridSetores) {
                                gridSetores.getEl().unmask();
                            }
                            Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                        }
                    });                
                }
            }
        },
        items: [],
        features: [{
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl: '{name}',
            hideGroupedHeader: true,
            enableGroupingMenu: true,
            startCollapsed: true
        }],                
        columns: [
            {
                text     : 'Descrição',
                flex: 1,
                sortable : true,
                hideable: false,
                groupable: false,
                dataIndex: 'descricao',
                summaryType: 'count',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return ((value === 0 || value > 1) ? '(' + value + ' Setores)' : '(1 Setor)');
                }                
            },
            {
                text     : 'Circunscrição',
                sortable : true,
                dataIndex: 'circunscricao'
            },
            {
                text: 'Disponível(is)',
                width: 150,
                sortable: true,
                dataIndex: 'qtd_disponivel',
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return (value == 0 || value > 1) ? '(' + value + ' vagas)' : '(1 vaga)';
                }
            },
            {
                text: 'Pedidos',
                width: 150,
                sortable: true,
                dataIndex: 'qtd_reservas',
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                    return (value == 0 || value > 1) ? '(' + value + ' reservas)' : '(1 reserva)';
                }
            }
        ],
        
        dockedItems: [],
        listeners: {
            rowclick: 'onRowClick'
        }
    }]
});
