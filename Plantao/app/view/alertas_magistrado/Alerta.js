Ext.define('Plantao.view.alertas_magistrado.Alerta', {
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
        'Plantao.view.alertas_magistrado.AlertaController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Plantao.util.DeviceUtil',
        'Plantao.util.JsonPUtil',
        'Ext.Date'
    ],

    xtype: 'alertas-magistrado-grid',
    controller: 'alertacontroller_magistrado',
    title: 'Alertas',
	iconCls: 'icon-sino',
    id: 'viewAlertasMagistrado',
    
    layout: {
        type: 'border'
    },
    height: 650,
    items: [{
        region: 'north',
        xtype: 'gridpanel',
        itemId: 'gridConcursosMagistrados',
        store: 'ConcursoStore',
        multiSelect: false,
        frame: false,
        stateId: 'concursosGrid',
        height: '50%',
        width: 750,
        title: 'Concursos em aberto',
        viewConfig: {
			stripeRows: true,
            listeners: {
                render: function(view) {
                    var gridAdministracao = Ext.getCmp('viewAlertasMagistrado');
                    if(gridAdministracao) {
                        gridAdministracao.getEl().mask();
                    }
					var chamada = {
						matriculaUsuario: localStorage.getItem("matricula"),
						passwd: Plantao.util.JsonPUtil.senha
					};					
					Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/magistrado/concursosDisponiveis'
						, chamada, null, 
                        {executaChamadaSuccess : function(result, obj){
                            if(gridAdministracao) {
                                gridAdministracao.getEl().unmask('Recuperando concursos...');
                            }
                            var info = result.infoRetornoConcurso;
							var concursos = info.concursos;

                            var grid = Ext.ComponentQuery.query('#gridConcursosMagistrados')[0];
                            var gridStore = grid.getStore();
                            gridStore.removeAll();
                            if(concursos) {
								
								Ext.Array.each(concursos, function(concurso, idx){
									var recusa = concurso.recusa;
									var escala = recusa.escala;
									
									var concursoId = concurso.id;
									var dhInicioConcurso = Ext.Date.parse(concurso.dtIniStr, 'd/m/Y');
									var dhFimConcurso = Ext.Date.parse(concurso.dtFimStr, 'd/m/Y');
									var idRecusa = recusa.id;
									var escalaId = escala.id;
									var magistradoId = escala.magistrado.id;
									var nomeMagistrado = escala.magistrado.nome;
									var matriculaMagistrado = escala.magistrado.matricula;
									
									var dtIniEscala = Ext.Date.parse(escala.dtInicioStr, 'd/m/Y');
									var dtFimEscala = Ext.Date.parse(escala.dtFimStr, 'd/m/Y');
									var modalidadeId = escala.modalidade.id;
									var modalidadeDesc = escala.modalidade.descricao;
									
									var row = {
										concurso_id: concursoId,
										dh_ini_concurso: dhInicioConcurso,
										dh_fim_concurso: dhFimConcurso,
										id_recusa: idRecusa,
										id_escala: escalaId,
										dh_inicio_escala: dtIniEscala,
										dh_fim_escala: dtFimEscala,
										id_modalidade: modalidadeId,
										desc_modalidade: modalidadeDesc,
										id_magistrado: magistradoId,
										nome_magistrado: nomeMagistrado,
										matricula_magistrado: matriculaMagistrado
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
						
                }
            }
        },
        items: [],
                
        columns: [
            {
                text     : 'Magistrado',
                sortable : true,
                width: 250,
                dataIndex: 'nome_magistrado'
            }, {
                text     : 'Início',
                sortable : true,
                width: 100,
                flex: 1,
                dataIndex: 'dh_inicio_escala',
				renderer: Ext.util.Format.dateRenderer('D, d/m/Y')
            }, {
                text: 'Fim',
                width: 100,
                sortable: true,
                flex: 1,
                dataIndex: 'dh_fim_escala',
                renderer: Ext.util.Format.dateRenderer('D, d/m/Y')
            }, {
                text: 'Modalidade',
                width: 300,
                sortable: true,
                dataIndex: 'desc_modalidade'
            }, {
				xtype: 'actioncolumn',
				header: 'Ação',
				width: 120,
				align: 'center',
				items:[{
					icon: 'resources/pictures/add_person.png',
					tooltip: 'Concorrer ao concurso',
					handler: 'onConcorrerConcurso',
					padding: '0 4 0 0'
				}]
			}
        ],
		dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
			width: '35%',
            items: ['->', {
                text: '',
                itemId: 'btnAtualizarPermutasConcursos',
                iconCls: 'icon-sorteio',
                tooltip: 'Atualizar',
                disabled: false,
                handler : 'onRefreshClick'
            }]
        }],		
        listeners: {
            selectionchange: function (view, selections, options) {

            },
			rerenderconcursos : 'onReRenderConcursos'
        }
    },{
		region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridPermutasMagistrado',
        store: 'PermutaStore',
        multiSelect: false,
        frame: false,
        stateId: 'permutasMagistradoGrid',
        height: '50%',
        width: 750,
        title: 'Permutas',
        viewConfig: {
			stripeRows: true,
            listeners: {
                render: function(view) {
                    var gridAdministracao = Ext.getCmp('viewAlertasMagistrado');
                    if(gridAdministracao) {
                        gridAdministracao.getEl().mask();
                    }
					var chamada = {
						matriculaUsuario: localStorage.getItem("matricula"),
						passwd: Plantao.util.JsonPUtil.senha
					};
					Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/magistrado/permutasPorUsuario'
						, chamada, null,
                        {executaChamadaSuccess : function(result, obj){
                            if(gridAdministracao) {
                                gridAdministracao.getEl().unmask('Recuperando permutas...');
                            }
                            var info = result.infoRetornoPermuta;
							var permutas = info.permutas;

                            var grid = Ext.ComponentQuery.query('#gridPermutasMagistrado')[0];
                            var gridStore = grid.getStore();
                            gridStore.removeAll();
                            if(permutas) {
								
								Ext.Array.each(permutas, function(permuta, idx){
									var parteMagistrado = permuta.parteMagistrado;
									
									var idPermuta;
									var idEscala;
									var dhInicioEscala;
									var dhFimEscala;
									var idModalidade;
									var descModalidade;
									var idMagistradoEscala;
									var nomeMagistrado;
									var matriculaMagistrado;
									var idMagistradoAtual;
									var flConfirmacao;
									if(parteMagistrado == 1) {
										escala = permuta.escala2;
										modalidade = escala.modalidade;
										magistrado = escala.magistrado;
										idPermuta = permuta.id;
										idEscala = escala.id;
										dhInicioEscala = Ext.Date.parse(escala.dtInicioStr, 'd/m/Y');
										dhFimEscala = Ext.Date.parse(escala.dtFimStr, 'd/m/Y');
										idModalidade = modalidade.id;
										descModalidade = modalidade.descricao;
										idMagistradoEscala = magistrado.id;
										nomeMagistrado = magistrado.nome;
										matriculaMagistrado = magistrado.matricula;
										
										magistradoAtual = permuta.escala1.magistrado;
										idMagistradoAtual = magistradoAtual.id;
										flConfirmacao = permuta.flAceiteParte1;
									} else {
										escala = permuta.escala1;
										modalidade = escala.modalidade;
										magistrado = escala.magistrado;
										idPermuta = permuta.id;
										idEscala = escala.id;
										dhInicioEscala = Ext.Date.parse(escala.dtInicioStr, 'd/m/Y');
										dhFimEscala = Ext.Date.parse(escala.dtFimStr, 'd/m/Y');
										idModalidade = modalidade.id;
										descModalidade = modalidade.descricao;
										idMagistradoEscala = magistrado.id;
										nomeMagistrado = magistrado.nome;
										matriculaMagistrado = magistrado.matricula;
										
										magistradoAtual = permuta.escala2.magistrado;
										idMagistradoAtual = magistradoAtual.id;
										flConfirmacao = permuta.flAceiteParte2;
									}
									
									var row = {
										id_permuta: idPermuta,
										id_escala: idEscala,
										dh_inicio_escala: dhInicioEscala,
										dh_fim_escala: dhFimEscala,
										id_modalidade_escala: idModalidade,
										desc_modalidade_escala: descModalidade,
										id_magistrado_escala: idMagistradoEscala,
										nome_magistrado_escala: nomeMagistrado,
										matricula_magistrado_escala: matriculaMagistrado,
										id_magistrado_confirmacao: idMagistradoAtual,
										fl_confirmacao: flConfirmacao
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
						
                }
            }
        },
        items: [],
                
        columns: [
            {
                text     : 'Magistrado',
                sortable : true,
                width: 250,
                dataIndex: 'nome_magistrado_escala'
            }, {
                text     : 'Início',
                sortable : true,
                width: 100,
                flex: 1,
                dataIndex: 'dh_inicio_escala',
				renderer: Ext.util.Format.dateRenderer('D, d/m/Y')
            }, {
                text: 'Fim',
                width: 100,
                sortable: true,
                flex: 1,
                dataIndex: 'dh_fim_escala',
                renderer: Ext.util.Format.dateRenderer('D, d/m/Y')
            }, {
                text: 'Modalidade',
                width: 300,
                sortable: true,
                dataIndex: 'desc_modalidade_escala'
            }, {
				xtype: 'actioncolumn',
				header: 'Ação',
				width: 120,
				align: 'center',
				items:[{
					icon: 'resources/pictures/check.png',
					tooltip: 'Aceitar permuta',
					handler: 'onAceitarPermuta',
					padding: '0 4 0 0'
				},{
					icon: 'resources/pictures/trash.png',
					tooltip: 'Recusar permuta',
					handler: 'onRecusarPermuta',
					padding: '0 4 0 0'
				}]
			}
        ],
		
        listeners: {
            selectionchange: function (view, selections, options) {
            },
			rerenderpermutas : 'onReRenderPermutas'
        }			
	}]
});
