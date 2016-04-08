Ext.define('Plantao.view.administracao_magistrado.Administracao', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.ux.CheckColumn',
        'Ext.form.field.Checkbox',
		'Ext.form.field.*',
        'Ext.window.MessageBox',
        'Plantao.view.main.MainController',
        'Plantao.view.main.MainModel',
        'Plantao.view.administracao_magistrado.AdministracaoController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Plantao.util.DeviceUtil',
        'Plantao.util.JsonPUtil',
        'Ext.Date'
    ],

    xtype: 'administracao-magistrado-grid',
    controller: 'administracaocontroller_magistrado',
    title: 'Escalas',
	iconCls: 'icon-classificacao-completa',
    id: 'viewAdministracaoMagistrado',
    
    layout: {
        type: 'border'
    },
    height: 650,
    items: [{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridAdministracao',
        store: 'EscalaStore',
        multiSelect: false,
        frame: false,
        stateId: 'setorGrid',
        height: 650,
        width: 750,
        title: 'Escalas encontradas',
        viewConfig: {
			stripeRows: false,
			getRowClass : function(record, index, rowParams, ds) {
				var modalidade = record.get('modalidadeId');
				var classe = '';
				if(record.get('flRecusado') || record.get('flPermutado')) {
					classe = 'rejeitado-row';
				} else if(modalidade == 1 || modalidade == 2) {
					classe = 'semanal-madr-row';
				} else if (modalidade == 3 || modalidade == 4){
					classe = 'finalsemana-row';
				} else if (modalidade == 5 || modalidade == 6){
					classe = 'feriado-row';
				}
				return classe;
			},
            listeners: {
                render: function(view) {
                    var gridAdministracao = Ext.getCmp('viewAdministracaoMagistrado');
                    if(gridAdministracao) {
                        gridAdministracao.getEl().mask();
                    }
                    Plantao.util.JsonPUtil.executaChamada(
                        'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/magistrado/ultimoSorteioValidoPublicado',
                        null,
                        {executaChamadaSuccess : function(result, obj){
                            if(gridAdministracao) {
                                gridAdministracao.getEl().unmask('Recuperando concursos...');
                            }
                            var info = result.infoRetornoSorteioPlantao;
							var sorteio = info.ultimoSorteioValido;

                            var grid = Ext.ComponentQuery.query('#gridAdministracao')[0];
                            var gridStore = grid.getStore();
                            gridStore.removeAll();
                            if(sorteio) {
								var escalas = info.ultimoSorteioValido.escalas;
								
								Ext.Array.each(escalas, function(escala, idx){
									var escalaId = escala.id;
									var sorteioId = sorteio.id;
									var magistradoId = escala.magistrado.id;
									var nomeMagistrado = escala.magistrado.nome;
									var matriculaMagistrado = escala.magistrado.matricula;
									
									var dtIni = Ext.Date.parse(escala.dtInicioStr, 'd/m/Y H:i:s');
									var dtFim = Ext.Date.parse(escala.dtFimStr, 'd/m/Y H:i:s');
									var modalidadeId = escala.modalidade.id;
									var modalidadeDesc = escala.modalidade.descricao;
									var flAtivo = escala.ativo;
									var flAutomatico = escala.automatico;
									var flRecusado = escala.recusado;
									var flPermutado = escala.permutado;
									
									var row = {escalaId: escalaId, 
											   sorteioId: sorteioId, 
											   magistradoId: magistradoId,
											   nomeMagistrado : nomeMagistrado,
											   matriculaMagistrado : matriculaMagistrado,
											   dtInicio: dtIni,
											   dtFim: dtFim,
											   modalidadeId : modalidadeId,
											   descModalidade : modalidadeDesc,
											   flAtivo: flAtivo,
											   flAutomatico: flAutomatico,
											   flRecusado: flRecusado,
											   flPermutado: flPermutado
											};
									gridStore.add(row);                
								});
							}
                        }, executaChamadaError: function(obj){
                            if(gridAdministracao) {
                                gridAdministracao.getEl().unmask();
                            }
                            Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                        }
                    });
					
					Plantao.util.JsonPUtil.executaChamada(
                        'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/parametrosFiltragem',
                        null,
                        {executaChamadaSuccess : function(result, obj){
                            var info = result.infoRetornoFiltragemPlantao;
							var valores = info.valoresFiltragem;

                            if(valores && valores.magistrados) {
								var grid = Ext.ComponentQuery.query('#txtFiltro_Magistrado')[0];
								var gridMagistrados = grid.getStore();
								gridMagistrados.removeAll();
								var magistrados = valores.magistrados;
								
								Ext.Array.each(magistrados, function(magistrado, idx){
									var magId = magistrado.id;
									var nome = magistrado.nome;
									var matricula = magistrado.matricula;
									var antiguiade = magistrado.antiguidade.criterio1;
									
									var row = {id: magId, 
											   nome: nome, 
											   matricula: matricula,
											   prioridade: antiguiade
											};
									gridMagistrados.add(row);                
								});
							}
							if(valores && valores.modalidades) {
								var grid = Ext.ComponentQuery.query('#cmbFiltro_Modalidade')[0];
								var gridModalidades = grid.getStore();
								gridModalidades.removeAll();
								var modalidades = valores.modalidades;
								Ext.Array.each(modalidades, function(modalidade, idx){
									var modId = modalidade.id;
									var desc = modalidade.descricao;
									
									var row = {id: modId, 
											   modalidade: desc
											};
									gridModalidades.add(row);                
								});
							}
							if(valores && valores.status) {
								var grid = Ext.ComponentQuery.query('#cmbFiltro_Status')[0];
								var gridStatus = grid.getStore();
								gridStatus.removeAll();
								var status = valores.status;
								Ext.Array.each(status, function(stat, idx){
									var statId = stat.id;
									var desc = stat.descricao;
									
									var row = {id: statId, 
											   nome: desc
											};
									gridStatus.add(row);                
								});
							}							
                        }, executaChamadaError: function(obj){
                            Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                        }
                    }); 					
                }
            }
        },
        items: [],
                
        columns: [
            {
                text     : 'Magistrado',
                sortable : true,
                width: 250,
                dataIndex: 'nomeMagistrado',
                field: {
                    xtype: 'textfield',
                    listeners : {
                        change: 'onChangeProcesso'
                    }
                }
            }, {
                text     : 'Início',
                sortable : true,
                width: 100,
                flex: 1,
                dataIndex: 'dtInicio',
                renderer: Ext.util.Format.dateRenderer('D, d/m/Y'),
                field: {
                    xtype: 'datefield',
                    format: 'd/m/Y'
                }
            }, {
                text: 'Fim',
                width: 100,
                sortable: true,
                flex: 1,
                dataIndex: 'dtFim',
                renderer: Ext.util.Format.dateRenderer('D, d/m/Y'),
                field: {
                    xtype: 'datefield',
                    format: 'd/m/Y'
                }
            }, {
                text: 'Modalidade',
                width: 300,
                sortable: true,
                dataIndex: 'descModalidade',                
                field: {
                    xtype: 'textfield'                    
                }
            }, {
				xtype: 'actioncolumn',
				header: 'Ação',
				width: 120,
				align: 'center',
				items:[{
					icon: 'resources/pictures/change.png',
					tooltip: 'Permutar escala',
					handler: 'onPermutarEscala',
					padding: '0 4 0 0'
				},{
					icon: 'resources/pictures/arrow-right.png',
					tooltip: 'Recusar escala',
					handler: 'onRecusarEscalaMagistrado',
					padding: '0 4 0 0'
				}]
			}
        ],
		
        listeners: {
            selectionchange: function (view, selections, options) {

            },
            rowclick : 'onRowClick',
			rerender : 'onReRender',
			refreshcomponent : 'onRefreshClick'
        },
		dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
			width: '35%',
            items: ['->', {
                text: '',
                itemId: 'btnAtualizarEscalas',
                iconCls: 'icon-sorteio',
                tooltip: 'Atualizar',
                disabled: false,
                handler : 'onRefreshClick'
            }]
        }],			
    },{
		region: 'north',
		xtype: 'form',
		collapsed: true,
		collapsible: true,
		title: 'Filtragem...',
		items: [{
			xtype: 'combo',
			itemId: 'txtFiltro_Magistrado',
			fieldLabel: 'Magistrado',
			width: '35%',
			queryMode: 'local',
			valueField: 'id',
			padding: '10 5 1 10',
			displayField: 'nome',
			store: 'MagistradoStore',
		},{
			xtype: 'datefield',
			padding: '1 5 1 10',
			name: 'dataInicio',
			fieldLabel: 'De',
			itemId: 'txtFiltro_dtInicio'
		},{
			xtype: 'datefield',
			padding: '1 5 1 10',
			name: 'dataFim',
			fieldLabel: 'Até',
			itemId: 'txtFiltro_dtFim'
		},{
			xtype: 'combo',
			itemId: 'cmbFiltro_Modalidade',
			padding: '1 5 1 10',
			width: '35%',
			queryMode: 'local',
			valueField: 'id',
			displayField: 'modalidade',
			fieldLabel: 'Modalidade',
			store: 'ModalidadeStore'
		},{
			xtype: 'combo',
			padding: '1 5 10 10',
			itemId: 'cmbFiltro_Status',
			queryMode: 'local',
			width: '35%',
			valueField: 'id',
			displayField: 'nome',
			fieldLabel: 'Status',
			store: 'StatusStore'
		}],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
			width: '35%',
            items: ['->', {
                text: '',
                itemId: 'btnFiltrarEscalas',
                iconCls: 'icon-filter',
                tooltip: 'Filtrar a listagem de escalas',
                disabled: false,
                handler : 'onExecutarFiltragemClick'
            },{
                text: '',
                itemId: 'btnLimparFiltragem',
                iconCls: 'icon-brush',
                tooltip: 'Limpar a filtragem',
                disabled: false,
                handler : 'onExecutarLimpezaFiltragemClick'
            }]
        }]	
	}]
});
