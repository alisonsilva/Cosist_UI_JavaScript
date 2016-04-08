Ext.define('Plantao.view.gerenciarpermuta.GerenciarPermutaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gerenciarpermutacontroller',
    requires: [
        'Ext.window.Window'    
    ],
    
	onReenviarNotificacaoPermuta : function(grid, rowIndex, colIndex, item, e, record) {
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja reenviar aviso?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var gridAdministracao = Ext.getCmp('viewGerenciarPermuta');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Enviando ...');
			}	
			
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				matriculaMagistrado: record.get('matricula')			
			};				

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/permuta/enviarMensagemPermuta'
					, chamada, null, {executaChamadaSuccess : function(result, obj){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						
						var info = result.infoRetornoCosist;
						var codigo = info.codigo;
						var mensagem = info.mensagem;
						if(codigo != 0) {
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
						} else {
							Plantao.util.DeviceUtil.showAlertaConfirma('Informação', mensagem, Ext.Msg.INFO, function(){});
						}
					}, executaChamadaError : function(){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao enviar mensagem', Ext.Msg.ERROR, function(){});
					}
			});			
			
		}, function(){//ação ao cancelar
			
		});				
	},
    	
	onCancelarPermutaClick : function() {
		var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RowID')[0];
		var escalaId = hiddenField.getValue();
		
		
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja cancelar a permuta?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			
			var gridAdministracao = Ext.getCmp('viewGerenciarPermuta');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Realizando ação...');
			}	

			var hiddenPermuta = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_permutaId')[0];
			var permutaId = hiddenPermuta.getValue();			
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				idPermuta: permutaId			
			};				

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/permuta/removerPermuta'
					, chamada, null, {executaChamadaSuccess : function(result, obj){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						
						var info = result.infoRetornoCosist;
						var codigo = info.codigo;
						var mensagem = info.mensagem;
						if(codigo != 0) {
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
						} else {
							var viewFiltro = Ext.getCmp('viewGerenciarPermuta');
							viewFiltro.destroy();
							
							var viewWindow = Ext.getCmp('windowAdministracaoPermuta');
							viewWindow.destroy();

							var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
							lstEscalas.fireEvent('rerender');
							
						}
					}, executaChamadaError : function(){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao realizar ação', Ext.Msg.ERROR, function(){});
					}
			});			
		}, function(){//ação ao cancelar
			
		});				
		
	},
	
	onChangeFlConfirmado : function(dtfield, rowIndex, checked, eOpts) {
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja realizar alteração?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var gridAdministracao = Ext.getCmp('viewGerenciarPermuta');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Realizando ação...');
			}	
		
			var me = this;
			var grid = Ext.ComponentQuery.query('#gridGerenciarPermuta')[0];
			var record = grid.getStore().getAt(rowIndex);    
			if (!record) {
				record = grid.getStore().getAt(0);
			}
			
			var flConf1 = null;
			var flConf2 = null;
			if(rowIndex == 0) {
				flConf1 = checked;
			} else if(rowIndex == 1) {
				flConf2 = checked;
			}
			var idPermuta = record.get('id_permuta');
			var idEscala = record.get('id_escala');
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				parteAlterada : (rowIndex + 1),
				flAceiteParte1: flConf1,
				flAceiteParte2: flConf2,
				idPermuta: idPermuta,
				idEscalaParte1: rowIndex == 0 ? idEscala : null,
				idEscalaParte2: rowIndex == 1 ? idEscala : null
			};

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/permuta/alterarAceite'
					, chamada, null, {executaChamadaSuccess : function(result, obj){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						
						var info = result.infoRetornoPermuta;
						var codigo = info.codigo;
						var mensagem = info.mensagem;
						if(codigo != 0) {
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
						} else if(info.permutaRealizada) {
							var viewFiltro = Ext.getCmp('viewGerenciarPermuta');
							viewFiltro.destroy();
							
							var viewWindow = Ext.getCmp('windowAdministracaoPermuta');
							viewWindow.destroy();

							var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
							lstEscalas.fireEvent('rerender');
						}
					}, executaChamadaError : function(){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao realizar ação', Ext.Msg.ERROR, function(){});
					}
			});			
			
		}, function(){//ação ao cancelar
			
		});				
	},
		
    onRender : function(rowid) {
        var gridSetores = Ext.getCmp('viewGerenciarPermuta');
        if(gridSetores) {
            gridSetores.getEl().mask('Recuperando...');
        }
		
		var hiddenf = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RowID')[0];
		hiddenf.setValue(rowid);
		
		var record = Ext.ComponentQuery.query('#gridAdministracao')[0].getStore().getAt(rowid);
        
        if(record) {
            var escalaId = record.get('escalaId');

            Plantao.util.JsonPUtil.executaChamada(
                'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/detalhesPermutaEscala/'+escalaId,
                null,
                {executaChamadaSuccess : function(result, obj){
                    if(gridSetores) {
                        gridSetores.getEl().unmask();
                    }
                    var info = result.infoRetornoEscalaPlantao;
					if(info.codigo == 0) {
						var escala = info.escala;					
						var historicos = escala.historicos;
						var permutas = escala.permutas;
						
						var historico = historicos[0];
						var txtDtPedidoPermuta = Ext.ComponentQuery.query('#dtGerenciarRecusa_Pedido')[0];
						txtDtPedidoPermuta.setValue(historico.dtHistoricoStr);
						var txtNomeExecutante = Ext.ComponentQuery.query('#txtGerenciarRecusa_Magistrado')[0];
						if(historico.magistrado) {
							txtNomeExecutante.setValue(historico.magistrado.nome);
						} else {
							txtNomeExecutante.setValue(historico.servidor.nome);
						}
						
						var gridGerenciarPermuta = Ext.ComponentQuery.query('#gridGerenciarPermuta')[0];
						var gridStore = gridGerenciarPermuta.getStore();
						gridStore.removeAll();
						
						var permuta = permutas[0];
						var magistrado1 = permuta.parte1;
						var magistrado2 = permuta.parte2;
						var escala1 = permuta.escala1;
						var escala2 = permuta.escala2;
						
						var obj1 = {
							id: magistrado1.id,
							nome: magistrado1.nome,
							matricula: magistrado1.matricula,
							fl_confirmado: permuta.flAceiteParte1,
							desc_modalidade: escala1.modalidade.descricao,
							dt_inicio:  Ext.Date.parse(escala1.dtInicioStr, 'd/m/Y'),
							dt_fim: Ext.Date.parse(escala1.dtFimStr, 'd/m/Y'),
							id_escala: escala1.id,
							id_permuta: permuta.id
						};
						
						var obj2 = {
							id: magistrado2.id,
							nome: magistrado2.nome,
							matricula: magistrado2.matricula,
							fl_confirmado: permuta.flAceiteParte2,
							desc_modalidade: escala2.modalidade.descricao,
							dt_inicio:  Ext.Date.parse(escala2.dtInicioStr, 'd/m/Y'),
							dt_fim: Ext.Date.parse(escala2.dtFimStr, 'd/m/Y'),
							id_escala: escala2.id,
							id_permuta: permuta.id
						};
						
						var hiddenPermuta = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_permutaId')[0];
						hiddenPermuta.setValue(permuta.id);
						
						gridStore.add(obj1);
						gridStore.add(obj2);
						
					} else {
						Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){}); 						
					}
					
                }, executaChamadaError: function(obj){
                    if(gridSetores) {
                        gridSetores.getEl().unmask();
                    }
                    Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                }
            });
        } 
    },

});