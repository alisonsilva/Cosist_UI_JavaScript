Ext.define('Plantao.view.rejeicaoescala.RejeicaoEscalaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.rejeicaoescalacontroller',
    requires: [
        'Ext.window.Window'    
    ],
    
	onCancelarRejeicaoClick : function() {
		var viewFiltro = Ext.getCmp('viewRejeicaoEscala');
		viewFiltro.destroy();
		
		var viewWindow = Ext.getCmp('windowRejeicaoEscala');
		viewWindow.destroy();
	},
	
	onConfirmaRejeicaoClick : function() {
		var me = this;
		
		
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja recusar o plantão?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var hiddenF = Ext.ComponentQuery.query('#hiddenRejeicaoEscala_RowID')[0];
			var rowIndex = hiddenF.getValue();
		
			var gridSorteio = Ext.ComponentQuery.query('#gridAdministracao')[0];
			var record = gridSorteio.getStore().getAt(rowIndex);
			if(!record) {
				record = gridSorteio.getStore().getAt(0);
			}		
			
			var chkJustificado = Ext.ComponentQuery.query('#chkRejeicao_Justificada')[0];
			var justificado = chkJustificado.getValue();
			
			
			var txtAreaJustificacao = Ext.ComponentQuery.query('#txtRejeicao_Justificativa')[0];
			var justificacao = txtAreaJustificacao.getValue();
			
			if(justificado) {
				if(Ext.isEmpty(justificacao)) {
					Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'É necessário preencher a justificativa.', Ext.Msg.ERROR, function(){});
					return;
				}
			}
			
			var hescala = {
				escalaId: record.get('escalaId'),
				recusaJustificada: justificado,
				justificativa: justificacao,
				matriculaMagistradoEscala: record.get('matriculaMagistrado')
			};
			
			var chamada = {
				hescala: hescala,
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha
			};
			
			var gridAdministracao = Ext.getCmp('viewAdministracao');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Recusando plantão...');
			}	

			var viewFiltro = Ext.getCmp('viewRejeicaoEscala');
			viewFiltro.destroy();
			
			var viewWindow = Ext.getCmp('windowRejeicaoEscala');
			viewWindow.destroy();			
			
			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/recusaEscala'
					, chamada, null, {executaChamadaSuccess : function(result, obj) {
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
							Plantao.util.DeviceUtil.showAlertaConfirma('Info', 'Pedido de recusa enviado com sucesso', Ext.Msg.INFO, function(){});
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
        
		var hiddenF = Ext.ComponentQuery.query('#hiddenRejeicaoEscala_RowID')[0];
		hiddenF.setValue(rowIndex);	

    },
	
	onChangeChk: function(checkBox, newValue, oldValue, eOpts ) {
		var txtAreaJustificacao = Ext.ComponentQuery.query('#txtRejeicao_Justificativa')[0];
		if(newValue) {
			txtAreaJustificacao.setDisabled(false);
		} else {
			txtAreaJustificacao.setDisabled(true);
		}
	}
  
});