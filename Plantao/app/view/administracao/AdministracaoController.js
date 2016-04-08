Ext.define('Plantao.view.administracao.AdministracaoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administracaocontroller',
    requires: [
        'Ext.window.Window'    
    ],

    onRowClick: function(grid, record, tr, rowIndex, e, options){
        console.log('row clicked');
    },
    
    onExibeClassificacaoClick : function() {
        var me = this;
        
        var win2 = Ext.create('Ext.window.Window', {
            height: 650,
            width: 1100,
            x: 200,
            y: 100,
            title: 'Classificação',
            closable: true,
            plain: true,
            modal: true,
            layout: 'fit',
            items: [Ext.create('Plantao.view.criterio.Criterio')]      
        });
        win2.show();
    },
	
	onPermutarEscala : function(grid, rowIndex, colIndex, item, e, record) {
        var me = this;
        
        var win2 = Ext.create('Ext.window.Window', {
            height: 650,
            width: 1100,
            x: 200,
            y: 100,
            title: 'Permuta',
            closable: true,
            plain: true,
            modal: true,
			id: 'windowPermutaEscala',
            layout: 'fit',
            items: [Ext.create('Plantao.view.permutaescala.FiltroAlteracaoEscala')]      
        });
        win2.show();
        win2.show();
		var vwFiltro = Ext.ComponentQuery.query('#formPermutaEscala')[0];
		vwFiltro.fireEvent('rerender', rowIndex);		
	},
    
	onDownloadEscalasFiltradasClick : function() {
			
		var magistradoRecord = Ext.ComponentQuery.query('#txtFiltro_Magistrado')[0].getSelection();
		var modalidadeRecord = Ext.ComponentQuery.query('#cmbFiltro_Modalidade')[0].getSelection();
		var dataInicio = Ext.ComponentQuery.query('#txtFiltro_dtInicio')[0].getValue();
		var dataFim = Ext.ComponentQuery.query('#txtFiltro_dtFim')[0].getValue();
		var cmbStatus = Ext.ComponentQuery.query('#cmbFiltro_Status')[0];
		
		var status = cmbStatus.getSelection();
		
		
		var magistradoId = 0;
		if(magistradoRecord) {
			magistradoId = magistradoRecord.get('id');
		}
		var modalidadeId = 0;
		if(modalidadeRecord){
			modalidadeId = modalidadeRecord.get('id');
		}
		
		var vlrDtInicio  = '0';
		if(dataInicio) {
			vlrDtInicio = Ext.Date.format(dataInicio, 'dmY');
		}
		var vlrDtFim = '0';
		if(dataFim) {
			vlrDtFim = Ext.Date.format(dataFim, 'dmY');
		}	

		var vlrStatus;
		if(status){
			vlrStatus = status.get('id');
			if(!vlrStatus) {
				vlrStatus = 1;
			}
		} else {
			vlrStatus = 1;
		}		
		
		Plantao.util.JsonPUtil.downloadArquivo({
			url: 'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/relatorioEscalasFiltradas',
			method: 'GET',
			params: [magistradoId, modalidadeId, vlrDtInicio, vlrDtFim, vlrStatus]
		});		
	},
	
	onAlterarEscala : function(grid, rowIndex, colIndex, item, e, record) {
        var me = this;
        
        var win2 = Ext.create('Ext.window.Window', {
            height: 250,
            width: 430,
            x: 200,
            y: 100,
            title: 'Alteração de escala de plantão',
            closable: true,
            plain: true,
            modal: true,
			id: 'windowFiltroAlteracaoEscala',
            layout: 'fit',
            items: [Ext.create('Plantao.view.filtroalteracaoescala.FiltroAlteracaoEscala')]      
        });
        win2.show();
		var vwFiltro = Ext.ComponentQuery.query('#formFiltroAlteracaoEscala')[0];
		vwFiltro.fireEvent('rerender', rowIndex);		
	},

	onRecusarEscala : function(grid, rowIndex, colIndex, item, e, record) {
		var flRecusada = record.get('flRecusado');
		if(flRecusada) {
			Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Plantão já recusado', Ext.Msg.ERROR, function(){});
		} else {
			var me = this;
			
			var win2 = Ext.create('Ext.window.Window', {
				height: 250,
				width: 430,
				x: 200,
				y: 100,
				title: 'Recusa de plantão',
				closable: true,
				plain: true,
				modal: true,
				id: 'windowRejeicaoEscala',
				layout: 'fit',
				items: [Ext.create('Plantao.view.rejeicaoescala.RejeicaoEscala')]      
			});
			win2.show();
			var vwFiltro = Ext.ComponentQuery.query('#formRejeicaoEscala')[0];
			vwFiltro.fireEvent('rerender', rowIndex);			
		}
	
	},
	
	onNovaEscalaClick : function() {
        var me = this;
        
        var win2 = Ext.create('Ext.window.Window', {
            height: 250,
            width: 430,
            x: 200,
            y: 100,
            title: 'Nova escala',
            closable: true,
            plain: true,
            modal: true,
			id: 'windowNovaEscala',
            layout: 'fit',
            items: [Ext.create('Plantao.view.escala.NovaEscala')]      
        });
        win2.show();
		var vwFiltro = Ext.ComponentQuery.query('#formNovaEscala')[0];
		vwFiltro.fireEvent('rerender');
	
	},	
	
	onExecutarLimpezaFiltragemClick : function() {
		var me = this;
		
		var cmbMag = Ext.ComponentQuery.query('#txtFiltro_Magistrado')[0];
		var dtInicioField = Ext.ComponentQuery.query('#txtFiltro_dtInicio')[0];
		var dtFimField = Ext.ComponentQuery.query('#txtFiltro_dtFim')[0];
		var cmbModalidade = Ext.ComponentQuery.query('#cmbFiltro_Modalidade')[0];
		var cmbStatus = Ext.ComponentQuery.query('#cmbFiltro_Status')[0];

		cmbMag.clearValue();
		dtInicioField.reset();
		dtFimField.reset();
		cmbModalidade.clearValue();
		cmbStatus.clearValue();
		
		var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
		lstEscalas.fireEvent('rerender');
	},
	
	onExecutarFiltragemClick: function() {
		var me = this;

		var cmbMag = Ext.ComponentQuery.query('#txtFiltro_Magistrado')[0];
		var dtInicioField = Ext.ComponentQuery.query('#txtFiltro_dtInicio')[0];
		var dtFimField = Ext.ComponentQuery.query('#txtFiltro_dtFim')[0];
		var cmbModalidade = Ext.ComponentQuery.query('#cmbFiltro_Modalidade')[0];
		var cmbStatus = Ext.ComponentQuery.query('#cmbFiltro_Status')[0];
		
		var magistrado = cmbMag.getSelection();
		var dtIni = dtInicioField.getValue();
		var dtFim = dtFimField.getValue();
		var modalidade = cmbModalidade.getSelection();
		var status = cmbStatus.getSelection();
		
		var vlrIdMagistrado;
		if(magistrado) {
			vlrIdMagistrado = magistrado.get('id');
		}
		var vlrDtInicio;
		if(dtIni) {
			vlrDtInicio = Ext.Date.format(dtIni, 'd/m/Y');
		}
		var vlrDtFim;
		if(dtFim) {
			vlrDtFim = Ext.Date.format(dtFim, 'd/m/Y');
		}
		var vlrModalidade;
		if(modalidade) {
			vlrModalidade = modalidade.get('id');
		}
		var vlrStatus;
		if(status){
			vlrStatus = status.get('id');
		}
		
		var req = {
			idMagistrado: vlrIdMagistrado,
			idModalidade: vlrModalidade,
			idStatus: vlrStatus,
			dataInicial: vlrDtInicio,
			dataFinal: vlrDtFim
		};
		
		var gridAdministracao = Ext.getCmp('viewAdministracao');
		if(gridAdministracao) {
			gridAdministracao.getEl().mask('Buscando escalas...');
		}
		
		
		Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/escalasFiltradas'
				, req, null, {executaChamadaSuccess : function(result, obj){
					if(gridAdministracao) {
						gridAdministracao.getEl().unmask();
					}
					
					var info = result.infoRetornoFiltragemPlantao;
					var codigo = info.codigo;
					var mensagem = info.mensagem;
					if(codigo != 0) {
						Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao buscar escalas: ' + mensagem, Ext.Msg.ERROR, function(){});
					} else {
						var sorteio = info.sorteio;
						var grid = Ext.ComponentQuery.query('#gridAdministracao')[0];
						var gridStore = grid.getStore();
						gridStore.removeAll();
						if(sorteio) {
							var escalas = sorteio.escalas;
							
							Ext.Array.each(escalas, function(escala, idx){
								var escalaId = escala.id;
								var sorteioId = sorteio.id;
								var magistradoId = escala.magistrado.id;
								var nomeMagistrado = escala.magistrado.nome;
								var matriculaMagistrado = escala.magistrado.matricula;
								
								var dtIni = Ext.Date.parse(escala.dtInicioStr, 'd/m/Y');
								var dtFim = Ext.Date.parse(escala.dtFimStr, 'd/m/Y');
								var modalidadeId = escala.modalidade.id;
								var modalidadeDesc = escala.modalidade.descricao;
								var flAtivo = escala.ativo;
								var flAutomatico = escala.automatico;
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
										   flRecusado: escala.recusado,
										   flPermutado: flPermutado
										};
								gridStore.add(row);                
							});
						}
					}                        
				}, executaChamadaError : function(){
					if(gridAdministracao) {
						gridAdministracao.getEl().unmask();
					}
					Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao buscar escalas', Ext.Msg.ERROR, function(){});
				}
		});			
	},
	
    onRealizarSorteioClick : function() {
        var me = this;
        var win2 = Ext.create('Ext.window.Window', {
            height: 650,
            width: 1100,
            x: 200,
            y: 100,
            title: 'Sorteios',
            closable: true,
            plain: true,
            modal: true,
            layout: 'fit',
            items: [Ext.create('Plantao.view.sorteio.Sorteio')]      
        });
        win2.show();
    },
    
	
	onReRender: function() {
		var gridAdministracao = Ext.getCmp('viewAdministracao');
		if(gridAdministracao) {
			gridAdministracao.getEl().mask();
		}
		Plantao.util.JsonPUtil.executaChamada(
			'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/ultimoSorteioValido',
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
	}	
   
});