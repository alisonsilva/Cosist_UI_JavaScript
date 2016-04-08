Ext.define('Plantao.view.criterio.Criterio', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Plantao.view.main.MainController',
        'Plantao.view.main.MainModel',
        'Plantao.view.setor.SetorController',
        'Plantao.view.criterio.CriterioController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Plantao.util.DeviceUtil',
        'Plantao.util.JsonPUtil'
    ],

    xtype: 'criterio-grid',
    controller: 'criteriocontroller',
    title: 'Classificação',
    id: 'viewCriterio',
    height: 650,
    layout: {
        type: 'border'
    },

    items: [{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridCriterio',
        store: 'CriterioStore',
        autoScroll: true,
        stateful: true,
        collapsible: false,
        disableSelection: true,
        loadMask: true,
        multiSelect: false,
        bufferedRenderer: false,
        viewConfig: {
            id: 'gv',
            trackOver: false,
            stripeRows: true,
            plugins: [{
                ptype: 'preview',
                bodyField: 'excerpt',
                expanded: true,
                pluginId: 'preview'
            }]
        },
        stateId: 'criterioGrid',
        height: 350,
        width: 1200,
        title: 'Classificação dos Oficiais de Justiça',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
                render: function(view) {
                    var grid = Ext.ComponentQuery.query('#gridCriterio')[0];
                    var gridStore = grid.getStore();
                    gridStore.loadPage(1);
                
                    /*
                    var gridAdm = Ext.ComponentQuery.query('#gridAdministracao')[0];
                    var record = gridAdm.getSelectionModel().getSelection()[0];
                    var concursoId = record.get('concursoId');
                
                    var gridSetores = Ext.getCmp('viewCriterio');
                    if(gridSetores) {
                        gridSetores.getEl().mask('Recuperando classificações...');
                    }
                    
                    var store = Ext.create('Ext.data.Store',);
                    
                    Plantao.util.JsonPUtil.executaChamada(
                        'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/listaCriterioRemocao/'+concursoId,
                        null,
                        {executaChamadaSuccess : function(result, obj){
                            if(gridSetores) {
                                gridSetores.getEl().unmask();
                            }
                            
                            var info = result.infoRetornoOficiaisJustica;
                            var interesses = info.criterios;
                            
                            var grid = Ext.ComponentQuery.query('#gridCriterio')[0];
                            var gridStore = grid.getStore();
                            gridStore.removeAll();
                            
                            Ext.Array.each(interesses, function(interesse, idx){
                                var row = {
                                    ranking: interesse.ranking,
                                    matricula: interesse.matricula,
                                    nome: interesse.nome,
                                    localizacao: interesse.localizacao,
                                    dataNascimento: interesse.dtNascimento,
                                    criterio1: interesse.criterio1,
                                    criterio2: interesse.criterio2,
                                    criterio3: interesse.criterio3,
                                    criterio4: interesse.criterio4,
                                    criterio5: interesse.criterio5,
                                    ascensao: interesse.ascensao,
                                    dataPosse: interesse.dtPosse,
                                    qtdDiasPosse: interesse.qtdDiasPosse,
                                    dataInicioAtividade: interesse.dtInicioAtividade,
                                    qtdDiasCargo: interesse.qtdDiasCargo,
                                    qtdDiasAtividade: interesse.qtdDiasAtividade,
                                    qtdDiasAntesIngresso: interesse.qtdDiasAntesIngresso,
                                    qtdPercentAqt: interesse.qtdPercentAqt,
                                    dataSituacaoFuncional: interesse.dtSituacaoFuncional,
                                    descSituacaoFuncional: interesse.descSituacaoFuncional,
                                    dataConsulta: interesse.dtConsulta
                                };
                                gridStore.add(row);                
                            });
                            
                        }, executaChamadaError: function(obj){
                            if(gridSetores) {
                                gridSetores.getEl().unmask();
                            }
                            Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                        }
                    });                
                    */
                }
            }
        },
        items: [],
                
        columns: [
            {
                text     : 'Classificação',
                width    : 200,
                sortable : false,
                dataIndex: 'ranking'
            },{
                text     : 'Matrícula',
                width    : 200,
                sortable : true,
                dataIndex: 'matricula'
            },{
                text: 'Nome',
                sortable: true,
                width    : 200,
                dataIndex: 'nome'
            },{
                text: 'Localização',
                sortable: true,
                width    : 200,
                dataIndex: 'localizacao'
            },{
                text: 'Nascimento',
                sortable: true,
                width    : 200,
                dataIndex: 'dataNascimento',
                renderer: Ext.util.Format.dateRenderer('d/m/Y')
            },{
                text: 'Critério 1',
                sortable: true,
                width    : 200,
                dataIndex: 'criterio1'
            },{
                text: 'Critério 2',
                sortable: true,
                width    : 200,
                dataIndex: 'criterio2'
            },{
                text: 'Critério 3',
                sortable: true,
                width    : 200,
                dataIndex: 'criterio3'
            },{
                text: 'Critério 4',
                sortable: true,
                width    : 200,
                dataIndex: 'criterio4'
            },{
                text: 'Critério 5',
                sortable: true,
                width    : 200,
                dataIndex: 'criterio5',
                renderer: Ext.util.Format.dateRenderer('d/m/Y')
            },{
                text: 'Ascensão',
                sortable: true,
                width    : 200,
                dataIndex: 'ascensao'
            },{
                text: 'Posse',
                sortable: true,
                width    : 200,
                dataIndex: 'dataPosse',
                renderer: Ext.util.Format.dateRenderer('d/m/Y')
            },{
                text: 'Qtd. dias Posse',
                sortable: true,
                width    : 200,
                dataIndex: 'qtdDiasPosse'
            },{
                text: 'Início atividade',
                sortable: true,
                width    : 200,
                dataIndex: 'dataInicioAtividade',
                renderer: Ext.util.Format.dateRenderer('d/m/Y')
            },{
                text: 'Qtd. dias cargo',
                sortable: true,
                width    : 200,
                dataIndex: 'qtdDiasCargo'
            },{
                text: 'Qtd. dias atividade',
                sortable: true,
                width    : 200,
                dataIndex: 'qtdDiasAtividade'
            },{
                text: 'Qtd. dias antes ingresso',
                sortable: true,
                width    : 200,
                dataIndex: 'qtdDiasAntesIngresso'
            },{
                text: 'Qtd. percentual AQT',
                sortable: true,
                width    : 200,
                dataIndex: 'qtdPercentAqt'
            },{
                text: 'Data situação funcional',
                sortable: true,
                width    : 200,
                dataIndex: 'dataSituacaoFuncional',
                renderer: Ext.util.Format.dateRenderer('d/m/Y')
            },{
                text: 'Desc. situação funcional',
                sortable: true,
                width    : 200,
                dataIndex: 'descSituacaoFuncional'
            },{
                text: 'Data consulta',
                sortable: true,
                width    : 200,
                dataIndex: 'dataConsulta',
                renderer: Ext.util.Format.dateRenderer('d/m/Y')
            }            
        ],
        
        dockedItems: [{
            xtype: 'pagingtoolbar',
            store: 'CriterioStore',
            dock: 'bottom',
            displayInfo: true
        }],
        listeners: {
            
        }
    }]
});
