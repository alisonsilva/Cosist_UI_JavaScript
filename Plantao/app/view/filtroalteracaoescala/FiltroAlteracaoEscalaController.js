Ext.define('Plantao.view.filtroalteracaoescala.FiltroAlteracaoEscalaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filtroalteracaoescalacontroller',
    requires: [
        'Ext.window.Window'    
    ],
    
	onCancelarAlteracaoClick : function() {
		var viewFiltro = Ext.getCmp('viewFiltroAlteracaoEscala');
		viewFiltro.destroy();
		
		var viewWindow = Ext.getCmp('windowFiltroAlteracaoEscala');
		viewWindow.destroy();
	},
	
	onConfirmaAlteracaoClick : function() {
		var me = this;
		
		
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja alterar o registro?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var hiddenF = Ext.ComponentQuery.query('#hiddenFiltroAlteracao_RowID')[0];
			var rowIndex = hiddenF.getValue();
		
			var gridSorteio = Ext.ComponentQuery.query('#gridAdministracao')[0];
			var record = gridSorteio.getStore().getAt(rowIndex); ;
			if(!record) {
				record = gridSorteio.getStore().getAt(0);
			}		
			
			var cmbMagistrado = Ext.ComponentQuery.query('#cmbFiltroAlteracao_Magistrado')[0];
			var magistrado = cmbMagistrado.getSelection();
			var idMagistrado = magistrado.get('id');
			
			var txtAreaJustificacao = Ext.ComponentQuery.query('#txtFiltroAlteracao_Justificativa')[0];
			var justificacao = txtAreaJustificacao.getValue();
			
			var escala = {
				id: record.get('escalaId'),
				dtInicioStr: Ext.Date.format(record.get('dtInicio'), 'd/m/Y'),
				dtFimStr: Ext.Date.format(record.get('dtFim'), 'd/m/Y'),
				idModalidade: record.get('modalidadeId'),
				idMagistrado: idMagistrado,
				justificativaAlteracao: justificacao
			};
			
			var chamada = {
				escala: escala,
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha
			};
			
			var gridAdministracao = Ext.getCmp('viewAdministracao');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Alterando plantão...');
			}	

			var viewFiltro = Ext.getCmp('viewFiltroAlteracaoEscala');
			viewFiltro.destroy();
			
			var viewWindow = Ext.getCmp('windowFiltroAlteracaoEscala');
			viewWindow.destroy();			
			
			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/alteraEscala'
						, chamada, null, {executaChamadaSuccess : function(result, obj){
							if(gridAdministracao) {
								gridAdministracao.getEl().unmask();
							}
							
							var info = result.infoRetornoSorteioPlantao;
							var codigo = info.codigo;
							var mensagem = info.mensagem;
							if(codigo != 0) {
								Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao alterar plantão: ' + mensagem, Ext.Msg.ERROR, function(){});
							} else {
								var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
								lstEscalas.fireEvent('rerender');
							}                        
						}, executaChamadaError : function(){
							if(gridAdministracao) {
								gridAdministracao.getEl().unmask();
							}
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao alterar plantão', Ext.Msg.ERROR, function(){});
						}
			});
			
		}, function(){//ação ao cancelar
			
		});		
	},
	
    onReRender : function(rowIndex) {
        var gridSetores = Ext.getCmp('viewFiltroAlteracaoEscala');
        if(gridSetores) {
            gridSetores.getEl().mask('Recuperando valores...');
        }
        
		var hiddenF = Ext.ComponentQuery.query('#hiddenFiltroAlteracao_RowID')[0];
		hiddenF.setValue(rowIndex);
		
        var gridSorteio = Ext.ComponentQuery.query('#gridAdministracao')[0];
        var record = gridSorteio.getStore().getAt(rowIndex); ;
        if(!record) {
            record = gridSorteio.getStore().getAt(0);
        }
        
        if(record) {
			Plantao.util.JsonPUtil.executaChamada(
				'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/parametrosFiltragem',
				null,
				{executaChamadaSuccess : function(result, obj){
					var info = result.infoRetornoFiltragemPlantao;
					var valores = info.valoresFiltragem;
					if(gridSetores) {
						gridSetores.getEl().unmask();
					}					

					if(valores && valores.magistrados) {
						var grid = Ext.ComponentQuery.query('#cmbFiltroAlteracao_Magistrado')[0];
						var gridMagistrados = grid.getStore();
						gridMagistrados.removeAll();
						var magistrados = valores.magistrados;
						
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
					
					/*
					if(valores && valores.modalidades) {
						var grid = Ext.ComponentQuery.query('#cmbFiltroAlteracao_Modalidade')[0];
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
					*/
					
					var filtroMagistrado = Ext.ComponentQuery.query('#cmbFiltroAlteracao_Magistrado')[0];
					var magistradoId = record.get('magistradoId');
					filtroMagistrado.select(magistradoId);
					
					/*var filtroModalidade = Ext.ComponentQuery.query('#cmbFiltroAlteracao_Modalidade')[0];
					var modalidadeId = record.get('modalidadeId');
					filtroModalidade.select(modalidadeId);
					
					var dtInicial = Ext.ComponentQuery.query('#txtFiltroAlteracao_dtInicio')[0];
					var dataInicial = record.get('dtInicio');
					dtInicial.setValue(dataInicial);
					
					
					var dtFinal = Ext.ComponentQuery.query('#txtFiltroAlteracao_dtFim')[0];
					var dataFinal = record.get('dtFim');
					dtFinal.setValue(dataFinal);*/					
					
				}, executaChamadaError: function(obj){
					if(gridSetores) {
						gridSetores.getEl().unmask();
					}					
					Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
				}
			}); 			
        }
    }
  
});