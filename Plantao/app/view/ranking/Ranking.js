Ext.define('Plantao.view.ranking.Ranking', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Plantao.view.main.MainController',
        'Plantao.view.main.MainModel',
        'Plantao.view.setor.SetorController',
        'Plantao.view.ranking.RankingController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Plantao.util.DeviceUtil',
        'Plantao.util.JsonPUtil',
		'Ext.ux.form.SearchField'
    ],

    xtype: 'ranking-grid',
    controller: 'rankingcontroller',
    title: 'Classificação',
    tooltip: 'Visualize a classificação dos Plantao para o procedimento atual',
    id: 'viewRanking',
    height: 650,
    layout: {
        type: 'border'
    },

    items: [{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridRanking',
        store: 'RankingStore',
        stateful: true,
        collapsible: false,
        multiSelect: false,
        bufferedRenderer: false,
        stateId: 'rankingGrid',
        height: 350,
        width: 750,
        title: 'Classificação dos Oficiais de Justiça',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
                render: function(view) {
                    matricula = localStorage.getItem("matricula");
                    var concursoId = localStorage.getItem("concursoId");
                    var gridSetores = Ext.getCmp('viewRanking');
                    if(gridSetores) {
                        gridSetores.getEl().mask('Recuperando classificações...');
                    }
                    Plantao.util.JsonPUtil.executaChamada(
                        'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/rankingOficiais/'+concursoId,
                        null,
                        {executaChamadaSuccess : function(result, obj){
                            if(gridSetores) {
                                gridSetores.getEl().unmask();
                            }
                            var info = result.infoRetornoOficiaisJustica;
                            var setores = info.interesses;

                            var grid = Ext.ComponentQuery.query('#gridRanking')[0];
                            var gridStore = grid.getStore();
                            gridStore.removeAll();
                            
                            Ext.Array.each(setores, function(setor, idx){
                                var row = {matricula: setor.matriculaOficial, 
                                           nome: setor.nomeOficial, 
                                           diasCargo: setor.qtdDiasOficial,
                                           ranking: setor.ranking};
                                gridStore.add(row);                
                            });
                            
                        }, executaChamadaError: function(obj){
                            if(gridSetores) {
                                gridSetores.getEl().unmask();
                            }
                            Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                        }
                    });                
                }
            }
        },
        items: [],
                
        columns: [
            {
                text     : 'Matrícula',
                width    : 200,
                sortable : false,
                dataIndex: 'matricula'
            },
            {
                text     : 'Nome',
                flex: 1,
                sortable : true,
                dataIndex: 'nome'
            },
            {
                text: 'Classificação',
                width: 150,
                sortable: true,
                dataIndex: 'ranking'
            }
        ],
        
        dockedItems: [{
			dock: 'top',
			xtype: 'toolbar',
			items: [{
				width: 400,
				fieldLabel: 'Filtro',
				xtype: 'textfield',
				enableKeyEvents: true,
				itemId: 'rankingSearchField',
				listeners: {
					keyup : function(txt, e, eOpts) {
						var fieldPesquisa = Ext.ComponentQuery.query('#rankingSearchField')[0];
						var store = Ext.ComponentQuery.query('#gridRanking')[0].getStore();
						store.filter('nome', fieldPesquisa.getValue());
					},
					change : function( field, newValue, oldValue, eOpts ) {
						var fieldPesquisa = Ext.ComponentQuery.query('#rankingSearchField')[0];
						var store = Ext.ComponentQuery.query('#gridRanking')[0].getStore();
						store.filter('nome', fieldPesquisa.getValue());
					},
					specialkey : function(field, e) {
						if(e.getKey() == e.BACKSPACE || 
								e.getKey() == e.DELETE) {
							var fieldPesquisa = Ext.ComponentQuery.query('#rankingSearchField')[0];
							var store = Ext.ComponentQuery.query('#gridRanking')[0].getStore();
							store.filter('nome', fieldPesquisa.getValue());
						}
					}
				}
			}]
		}],
        listeners: {
            initComponent : function() {
			}
        }
    }]
});
