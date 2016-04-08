Ext.define('Plantao.view.permutaescala.PermutaEscalaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.permutaescalacontroller',
    requires: [
        'Ext.window.Window'    
    ],
    
	cmbSelect : function( combo, record, eOpts ) {
		var gridAdministracao = Ext.getCmp('viewPermutaEscala');
		if(gridAdministracao) {
			gridAdministracao.getEl().mask('Recuperando plantões...');
		}
		
		var hiddenF = Ext.ComponentQuery.query('#hiddenPermutaEscala_RowID')[0];
		var rowIndex = hiddenF.getValue();
		
        var gridSorteio = Ext.ComponentQuery.query('#gridAdministracao')[0];
        var record = gridSorteio.getStore().getAt(rowIndex); ;
        if(!record) {
            record = gridSorteio.getStore().getAt(0);
        }		
		
		var cmbMagistrado = Ext.ComponentQuery.query('#cmbPermutaEscala_Magistrado')[0];
		var mag = cmbMagistrado.getSelection();
		if(mag) {
			Plantao.util.JsonPUtil.executaChamada(
				'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/escalasMagistradoSorteio/'+record.get('sorteioId')+'/'+mag.get('id'),
				null,
				{executaChamadaSuccess : function(result, obj){
					if(gridAdministracao) {
						gridAdministracao.getEl().unmask();
					}
					var info = result.infoRetornoFiltragemPlantao;
					var escalas = info.escalas;

					var grid = Ext.ComponentQuery.query('#gridPermutaEscala')[0];
					var gridStore = grid.getStore();
					gridStore.removeAll();
					if(escalas) {
						Ext.Array.each(escalas, function(escala, idx){
							var escalaId = escala.id;
							var sorteioId = escala.idSorteio;
							var magistradoId = escala.magistrado.id;
							var nomeMagistrado = escala.magistrado.nome;
							var matriculaMagistrado = escala.magistrado.matricula;
							
							var dtIni = Ext.Date.parse(escala.dtInicioStr, 'd/m/Y');
							var dtFim = Ext.Date.parse(escala.dtFimStr, 'd/m/Y');
							var modalidadeId = escala.modalidade.id;
							var modalidadeDesc = escala.modalidade.descricao;
							
							var row = {escalaId: escalaId, 
									   sorteioId: sorteioId, 
									   magistradoId: magistradoId,
									   nomeMagistrado : nomeMagistrado,
									   matriculaMagistrado : matriculaMagistrado,
									   dtInicio: dtIni,
									   dtFim: dtFim,
									   modalidadeId : modalidadeId,
									   descModalidade : modalidadeDesc
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
	},
	
	onCancelarPermutaClick : function() {
		var viewFiltro = Ext.getCmp('viewPermutaEscala');
		viewFiltro.destroy();
		
		var viewWindow = Ext.getCmp('windowPermutaEscala');
		viewWindow.destroy();
	},
	
	
    onReRender : function(rowIndex) {
        var viewPermuta = Ext.getCmp('viewPermutaEscala');
        if(viewPermuta) {
            viewPermuta.getEl().mask('Recuperando valores...');
        }
        
		var hiddenF = Ext.ComponentQuery.query('#hiddenPermutaEscala_RowID')[0];
		hiddenF.setValue(rowIndex);
		
        var gridSorteio = Ext.ComponentQuery.query('#gridAdministracao')[0];
        var record = gridSorteio.getStore().getAt(rowIndex); ;
        if(!record) {
            record = gridSorteio.getStore().getAt(0);
        }
        
        if(record) {
			Plantao.util.JsonPUtil.executaChamada(
				'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/escalaPermutaRecusa/'+record.get('escalaId'),
				null,
				{executaChamadaSuccess : function(result, obj){
					var info = result.infoRetornoCosist;
					if(info.codigo == 0) {
						Plantao.util.JsonPUtil.executaChamada(
							'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/magistradosPermuta/'+record.get('sorteioId'),
							null,
							{executaChamadaSuccess : function(result, obj){
								var info = result.infoRetornoFiltragemPlantao;
								var magistrados = info.magistrados;
								if(viewPermuta) {
									viewPermuta.getEl().unmask();
								}					

								if(magistrados) {
									var grid = Ext.ComponentQuery.query('#cmbPermutaEscala_Magistrado')[0];
									var gridMagistrados = grid.getStore();
									gridMagistrados.removeAll();
									
									Ext.Array.each(magistrados, function(magistrado, idx){
										var magId = magistrado.id;
										var nome = magistrado.nome;
										var matricula = magistrado.matricula;
										
										var row = {id: magId, 
												   nome: nome, 
												   matricula: matricula
												};
										gridMagistrados.add(row);                
									});
								}
								
							}, executaChamadaError: function(obj){
								if(viewPermuta) {
									viewPermuta.getEl().unmask();
								}					
								Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
							}
						}); 			
					} else if (info.codigo == 321) {
						if(viewPermuta) {
							viewPermuta.getEl().unmask();
						}					
						Plantao.util.DeviceUtil.showAlertaConfirma('Erro', info.mensagem, Ext.Msg.ERROR, function(){
							var viewFiltro = Ext.getCmp('viewPermutaEscala');
							viewFiltro.destroy();			
							var viewWindow = Ext.getCmp('windowPermutaEscala');
							viewWindow.destroy();											
						});     
					} else {
						if(viewPermuta) {
							viewPermuta.getEl().unmask();
						}					
						Plantao.util.DeviceUtil.showAlertaConfirma('Erro','Erro ao executar chamada', Ext.Msg.ERROR, function(){});     
					}
				}, executaChamadaError: function(obj){
					if(viewPermuta) {
						viewPermuta.getEl().unmask();
					}					
					Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
				}
			}); 			
			
        }
    },
	
	onConfirmarPermutaEscala :  function(grid, rowIndex, colIndex, item, e, record) {
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja solicitar permuta?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var myrecord2 = Ext.ComponentQuery.query('#gridPermutaEscala')[0].getStore().getAt(rowIndex);
			var magParte2ID = myrecord2.get('magistradoId');
		
			var hiddenF = Ext.ComponentQuery.query('#hiddenPermutaEscala_RowID')[0];
			var minhaLinha = hiddenF.getValue();
			var gridSorteio = Ext.ComponentQuery.query('#gridAdministracao')[0];
			var myrecord = gridSorteio.getStore().getAt(minhaLinha);
			var magParte1ID = myrecord.get('magistradoId');
			
			if(magParte1ID == magParte2ID) {
				Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Não é possível realizar permuta. São os mesmos magistrados.', Ext.Msg.ERROR, function(){});
			} else {
				var escalaId1 = myrecord.get('escalaId');
				var escalaId2 = myrecord2.get('escalaId');
				var gridSorteio = Ext.ComponentQuery.query('#gridAdministracao')[0];
				
				var chamada = {
					matriculaUsuario: localStorage.getItem("matricula"),
					passwd: Plantao.util.JsonPUtil.senha, 
					idParte1: magParte1ID,
					idParte2: magParte2ID,
					idEscalaParte1: escalaId1,
					idEscalaParte2: escalaId2,
					matriculaMagistrado: myrecord.get('matriculaMagistrado')
				};
				
				var viewSorteio = Ext.getCmp('viewPermutaEscala');
				if(viewSorteio) {
					viewSorteio.getEl().mask('Realizando pedido de permuta...');
				}

				Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/realizaPermuta'
							, chamada, null, {executaChamadaSuccess : function(result, obj){
								if(viewSorteio) {
									viewSorteio.getEl().unmask();
								}
								
								var info = result.infoRetornoCosist;
								var codigo = info.codigo;
								var mensagem = info.mensagem;
								var grid = Ext.ComponentQuery.query('#gridPermutaEscala')[0];
								var gridStore = grid.getStore();
								gridStore.removeAll();
								if(codigo != 0) {
									Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao permutar escala: ' + mensagem, Ext.Msg.ERROR, function(){});
								} else {
									var viewFiltro = Ext.getCmp('viewPermutaEscala');
									viewFiltro.destroy();			
									var viewWindow = Ext.getCmp('windowPermutaEscala');
									viewWindow.destroy();											
									
									var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
									lstEscalas.fireEvent('rerender');
								}                        
							}, executaChamadaError : function(){
								var grid = Ext.ComponentQuery.query('#gridPermutaEscala')[0];
								var gridStore = grid.getStore();
								gridStore.removeAll();
								if(viewSorteio) {
									viewSorteio.getEl().unmask();
								}
								Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao alterar sorteio', Ext.Msg.ERROR, function(){});
							}
				}); 				

			}
		
		}, function(){//ação ao cancelar			
		});		
	}
  
});