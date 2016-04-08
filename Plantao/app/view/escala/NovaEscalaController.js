Ext.define('Plantao.view.escala.NovaEscalaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.novaescalacontroller',
    requires: [
        'Ext.window.Window'    
    ],
    
	onCancelarNovaEscalaClick : function() {
		var viewFiltro = Ext.getCmp('viewNovaEscala');
		viewFiltro.destroy();
		
		var viewWindow = Ext.getCmp('windowNovaEscala');
		viewWindow.destroy();
	},
	
	onConfirmarNovaClick : function() {
		var me = this;
		
		
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja incluir plantão?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var cmbSorteio = Ext.ComponentQuery.query('#cmbNEscala_Sorteio')[0];
			var dtInicioField = Ext.ComponentQuery.query('#dtNEscala_dtInicio')[0];
			var dtFimField = Ext.ComponentQuery.query('#dtNEscala_dtFim')[0];
			var cmbModalidade = Ext.ComponentQuery.query('#cmbNEscala_Modalidade')[0];
			var cmbMagistrado = Ext.ComponentQuery.query('#cmbNEscala_Magistrado')[0];
				
			var magistrado = cmbMagistrado.getSelection();
			var modalidade = cmbModalidade.getSelection();
			var sorteio = cmbSorteio.getSelection();
			var dtIni = dtInicioField.getValue();
			var dtFim = dtFimField.getValue();
			
			var vlrDtInicio;
			if(dtIni) {
				vlrDtInicio = Ext.Date.format(dtIni, 'Ymd');
			}
			var vlrDtFim;
			if(dtFim) {
				vlrDtFim = Ext.Date.format(dtFim, 'Ymd');
			}			
			
			var hescala = {
				dtInicioStr: vlrDtInicio,
				dtFimStr: vlrDtFim,
				idModalidade: modalidade.get('id'),
				idSorteio: sorteio.get('id'),
				idMagistrado: magistrado.get('id')
			};
			
			var chamada = {
				escala: hescala,
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha
			};
			
			var gridAdministracao = Ext.getCmp('viewAdministracao');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Recusando plantão...');
			}	

			
			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/insereEscala'
						, chamada, null, {executaChamadaSuccess : function(result, obj){
							if(gridAdministracao) {
								gridAdministracao.getEl().unmask();
							}
							
							var info = result.infoRetornoSorteioPlantao;
							var codigo = info.codigo;
							var mensagem = info.mensagem;
							if(codigo != 0) {
								Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
							} else {
								var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
								lstEscalas.fireEvent('rerender');
								Plantao.util.DeviceUtil.showAlertaConfirma('Info', 'Escala inserida com sucesso', Ext.Msg.INFO, function(){});
								var viewFiltro = Ext.getCmp('viewNovaEscala');
								viewFiltro.destroy();
								
								var viewWindow = Ext.getCmp('windowNovaEscala');
								viewWindow.destroy();			
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
	
	
	
    onReRenderNovaEscala : function() {
		var gridNovaEscala = Ext.getCmp('viewNovaEscala');
		if(gridNovaEscala) {
			gridNovaEscala.getEl().mask();
		}
		
		Plantao.util.JsonPUtil.executaChamada(
			'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/parametrosFiltragem',
			null,
			{executaChamadaSuccess : function(result, obj){
				var info = result.infoRetornoFiltragemPlantao;
				var valores = info.valoresFiltragem;
				if(gridNovaEscala) {
					gridNovaEscala.getEl().unmask('Recuperando parâmetros...');
				}

				if(valores && valores.magistrados) {
					var grid = Ext.ComponentQuery.query('#cmbNEscala_Magistrado')[0];
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
				if(valores && valores.modalidades) {
					var grid = Ext.ComponentQuery.query('#cmbNEscala_Modalidade')[0];
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
				if(valores && valores.sorteios) {
					var grid = Ext.ComponentQuery.query('#cmbNEscala_Sorteio')[0];
					var gridModalidades = grid.getStore();
					gridModalidades.removeAll();
					var sorteios = valores.sorteios;
					Ext.Array.each(sorteios, function(sorteio, idx){
						var modId = sorteio.id;
						var desc = sorteio.nome;
						
						var row = {id: modId, 
								   nome: desc
								};
						gridModalidades.add(row);                
					});
				}							
			}, executaChamadaError: function(obj){
				if(gridNovaEscala) {
					gridNovaEscala.getEl().unmask('Recuperando concursos...');
				}
				
				Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
			}
		});
	}
  
});