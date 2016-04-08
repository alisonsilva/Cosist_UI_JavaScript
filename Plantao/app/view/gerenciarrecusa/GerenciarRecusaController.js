Ext.define('Plantao.view.gerenciarrecusa.GerenciarRecusaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gerenciarrecusacontroller',
    requires: [
        'Ext.window.Window'    
    ],
    
    onRowClick : function() {
    },
	
	onAdicionarConcursandoClick : function() {
		var registro = {
			id: null,
			nome: '',
			matricula: '',
			prioridade: null
		}
		var grid = Ext.ComponentQuery.query('#gridGerenciarRecusa')[0];
		var gridStore = grid.getStore();
		gridStore.add(registro);
	},
	
	cmbSelecionarMagistradoSelect : function(combo, record, eOpts ) {
		var grid = Ext.ComponentQuery.query('#gridGerenciarRecusa')[0];
		var gridStore = grid.getStore();

		var recSel = combo.getSelection();
		if(recSel) {
			var sel = grid.getSelectionModel().getSelection()[0];
			var magMatricula = recSel.get('matricula');
			qtd = gridStore.getCount();
			magistradosConcurso = [];
			duplicado = false;
			for(idx = 0; idx < qtd; idx++) {
				if(gridStore.getAt(idx).get('matricula') == magMatricula) {
					duplicado = true;
				}
			}
			
			if(duplicado) {
				Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Magistrado já cadastrado', Ext.Msg.ERROR, function(){});
			} else {
				var magId = recSel.get('id');
				var magPrioridade = recSel.get('prioridade');
				var magNome = recSel.get('nome');
				
				sel.set('nome', magNome, {dirty: false});
				sel.set('matricula', magMatricula, {dirty: false});
				sel.set('prioridade', magPrioridade, {dirty: false});
				sel.set('id', magId, {dirty: false});
				
				qtd = gridStore.getCount();
				magistradosConcurso = [];
				for(idx = 0; idx < qtd; idx++) {
					Ext.Array.include(magistradosConcurso, gridStore.getAt(idx).get('matricula'));
				}				
				
				var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RowID')[0];
				var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RecusaID')[0];
				
				var recusaId = hiddenField.getValue();	
				escalaId = hiddenField.getValue();			
				
				var gridAdministracao = Ext.getCmp('viewGerenciarRecusaSorteio');
				if(gridAdministracao) {
					gridAdministracao.getEl().mask('Incluindo...');
				}		
				
				var chamada = {
					matriculaUsuario: localStorage.getItem("matricula"),
					passwd: Plantao.util.JsonPUtil.senha, 
					idRecusa: recusaId,
					idEscala: escalaId,
					matriculasMagistrados: magistradosConcurso
				};	
				Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/concurso/adicionarMagistradosAdm'
						, chamada, null, {executaChamadaSuccess : function(result, obj){
							if(gridAdministracao) {
								gridAdministracao.getEl().unmask();
							}
							
							var info = result.infoRetornoCosist;
							var codigo = info.codigo;
							var mensagem = info.mensagem;
							if(codigo != 0) {
								Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
							}                        
						}, executaChamadaError : function(){
							if(gridAdministracao) {
								gridAdministracao.getEl().unmask();
							}
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao realizar ação', Ext.Msg.ERROR, function(){});
						}
				});				
				
			}
			
		} else {
			//gridStore.add(registro);
		}
	},
	
	onChangeDtEncerramento : function ( dtField, newValue, oldValue, eOpts ) {
		var strData =  Ext.Date.format(newValue, 'd/m/Y') + ' 23:59:00';
		var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RecusaID')[0];
		var recusaId = hiddenField.getValue();
		
		var chamada = {
			matriculaUsuario: localStorage.getItem("matricula"),
			passwd: Plantao.util.JsonPUtil.senha, 
			idRecusa: recusaId,
			dtFimStr: strData
		};		
		var gridAdministracao = Ext.getCmp('viewGerenciarRecusaSorteio');
		if(gridAdministracao) {
			gridAdministracao.getEl().mask('Realizando ação...');
		}		
		
		
		Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/concurso/alterarDataFinal'
				, chamada, null, {executaChamadaSuccess : function(result, obj){
					if(gridAdministracao) {
						gridAdministracao.getEl().unmask();
					}
					
					var info = result.infoRetornoCosist;
					var codigo = info.codigo;
					var mensagem = info.mensagem;
					if(codigo != 0) {
						Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
					}                        
				}, executaChamadaError : function(){
					if(gridAdministracao) {
						gridAdministracao.getEl().unmask();
					}
					Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao realizar ação', Ext.Msg.ERROR, function(){});
				}
		});			
		
	},
	
	onIniciarConcursoClick : function() {
		var botaoEncerrar = Ext.ComponentQuery.query('#btnEncerrarConcurso')[0];		
		var botaoIniciar = Ext.ComponentQuery.query('#btnIniciarConcurso')[0];
		var botaoAdicionar = Ext.ComponentQuery.query('#btnAdicionarConcursando')[0];
		var botaoPublicar = Ext.ComponentQuery.query('#btnPublicarResultadoConcurso')[0];		
		var dtEncerramento = Ext.ComponentQuery.query('#dtGerenciarRecusa_DtEncerramento')[0];
		
		
		botaoIniciar.setVisible(false);
		botaoEncerrar.setVisible(true);
		botaoAdicionar.setDisabled(false);
		botaoPublicar.setVisible(false);							
		dtEncerramento.setDisabled(false);
		
		dtEncerramento.setValue(Ext.Date.add(new Date(), Ext.Date.DAY, 2));
		
		
		var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RecusaID')[0];
		var recusaId = hiddenField.getValue();
		
		var gridAdministracao = Ext.getCmp('viewGerenciarRecusaSorteio');
		if(gridAdministracao) {
			gridAdministracao.getEl().mask('Realizando ação...');
		}		
		var dtEncerramentoStr = Ext.Date.format(dtEncerramento.getValue(), 'd/m/Y') + ' 23:59:00';
		
		var chamada = {
			matriculaUsuario: localStorage.getItem("matricula"),
			passwd: Plantao.util.JsonPUtil.senha, 
			idRecusa: recusaId,
			dtFimStr: dtEncerramentoStr
		};		
		
		Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/concurso/habilitaConcurso'
				, chamada, null, {executaChamadaSuccess : function(result, obj){
					if(gridAdministracao) {
						gridAdministracao.getEl().unmask();
					}
					
					var info = result.infoRetornoCosist;
					var codigo = info.codigo;
					var mensagem = info.mensagem;
					if(codigo != 0) {
						Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
					}                        
				}, executaChamadaError : function(){
					if(gridAdministracao) {
						gridAdministracao.getEl().unmask();
					}
					Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao realizar ação', Ext.Msg.ERROR, function(){});
				}
		});			
	},
	
	onEncerrarConcursoClick : function() {
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja encerrar o concurso? \n' +
													'Lembrando que não será mais possível cadastrar participantes.', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var botaoEncerrar = Ext.ComponentQuery.query('#btnEncerrarConcurso')[0];		
			var botaoIniciar = Ext.ComponentQuery.query('#btnIniciarConcurso')[0];
			var botaoAdicionar = Ext.ComponentQuery.query('#btnAdicionarConcursando')[0];
			var dtEncerramento = Ext.ComponentQuery.query('#dtGerenciarRecusa_DtEncerramento')[0];

			
			botaoIniciar.setVisible(true);
			botaoEncerrar.setVisible(false);
			botaoAdicionar.setDisabled(true);
			dtEncerramento.setDisabled(true);
			
			var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RecusaID')[0];
			var recusaId = hiddenField.getValue();
			
			var gridAdministracao = Ext.getCmp('viewGerenciarRecusaSorteio');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Realizando ação...');
			}		
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				idRecusa: recusaId			
			};		
			
			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/concurso/desabilitaConcurso'
					, chamada, null, {executaChamadaSuccess : function(result, obj){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						
						var info = result.infoRetornoEscalaPlantao;
						var codigo = info.codigo;
						var mensagem = info.mensagem;
						var qtdInscritos = info.qtdInscritos;
						if(codigo != 0) {
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
						} 
						if(qtdInscritos > 0) {
							var botaoPublicar = Ext.ComponentQuery.query('#btnPublicarResultadoConcurso')[0];		
							botaoPublicar.setVisible(true);							
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
        
	onPublicarResultadoConcursoClick : function() {
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja publicar o concurso? \n' +
													'Lembrando que os magistrados concorrentes serão notificados ' +
													'e o com maior prioridade será atribuído ao plantão.', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RecusaID')[0];
			var recusaId = hiddenField.getValue();	

			hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RowID')[0];
			var escalaId = hiddenField.getValue();
			
			var gridAdministracao = Ext.getCmp('viewGerenciarRecusaSorteio');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Realizando ação...');
			}		
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				idRecusa: recusaId,
				idEscala: escalaId
			};		

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/publicaRecusa'
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
							var viewFiltro = Ext.getCmp('viewGerenciarRecusaSorteio');
							viewFiltro.destroy();
							
							var viewWindow = Ext.getCmp('windowAdministracaoRecusa');
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
		
	onCancelarRecusaClick : function() {
		var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RowID')[0];
		var escalaId = hiddenField.getValue();
		
		
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja cancelar a recusa? \n' +
													'Lembrando que as informações sobre o concurso serão permanentemente apagadas.', Ext.Msg.QUESTION, function(){// ação ao confirmar
			
			var gridAdministracao = Ext.getCmp('viewGerenciarRecusaSorteio');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Realizando ação...');
			}		
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				idEscala: escalaId			
			};				

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/concurso/cancelaRecusa'
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
							var viewFiltro = Ext.getCmp('viewGerenciarRecusaSorteio');
							viewFiltro.destroy();
							
							var viewWindow = Ext.getCmp('windowAdministracaoRecusa');
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
		
    onRender : function(record) {
        var gridSetores = Ext.getCmp('viewGerenciarRecusaSorteio');
        if(gridSetores) {
            gridSetores.getEl().mask('Recuperando...');
        }
		var botaoEncerrar = Ext.ComponentQuery.query('#btnEncerrarConcurso')[0];
		var botaoAdicionar = Ext.ComponentQuery.query('#btnAdicionarConcursando')[0];
		botaoEncerrar.setVisible(false);
		
		var botaoPublicar = Ext.ComponentQuery.query('#btnPublicarResultadoConcurso')[0];
		botaoPublicar.setVisible(false);
        
        if(record) {
            var escalaId = record.get('escalaId');
			var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RowID')[0];
			hiddenField.setValue(escalaId);
            Plantao.util.JsonPUtil.executaChamada(
                'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/recusaPorEscala/'+escalaId,
                null,
                {executaChamadaSuccess : function(result, obj){
                    if(gridSetores) {
                        gridSetores.getEl().unmask();
                    }
                    var info = result.infoRetornoEscalaPlantao;
                    var escala = info.escala;
					var recusa = escala.recusa;
                    var magistrado = escala.magistrado;
					var concurso = recusa.concurso;

					var hiddenRecusaField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RecusaID')[0];
					hiddenRecusaField.setValue(recusa.id);
					
					var txtData = Ext.ComponentQuery.query('#dtGerenciarRecusa_Pedido')[0];
					txtData.setValue(recusa.strData);
					
					var txtMagistrado = Ext.ComponentQuery.query('#txtGerenciarRecusa_Magistrado')[0];
					txtMagistrado.setValue(magistrado.nome);
					
					var chkJustificada = Ext.ComponentQuery.query('#chkGerenciarRecusa_Justificado')[0];
					chkJustificada.setValue(recusa.flJustificada);
					
					var txtJustificativa = Ext.ComponentQuery.query('#txtGerenciarRecusa_Justificativa')[0];
					txtJustificativa.setValue(recusa.descricao);
					//txtJustificativa.setTooltip(recusa.descricao);

                    var grid = Ext.ComponentQuery.query('#gridGerenciarRecusa')[0];
                    var gridStore = grid.getStore();
                    gridStore.removeAll();    
                    
					if(!concurso) {
						return;
					}
					
					var botaoEncerrar = Ext.ComponentQuery.query('#btnEncerrarConcurso')[0];		
					var botaoIniciar = Ext.ComponentQuery.query('#btnIniciarConcurso')[0];
					var dtEncerramento = Ext.ComponentQuery.query('#dtGerenciarRecusa_DtEncerramento')[0];
					
					dtEncerramento.setValue(Ext.Date.parse(concurso.dtFimStr, 'd/m/Y'));

					if(concurso.valido) {
						botaoIniciar.setVisible(false);
						botaoEncerrar.setVisible(true);	
						botaoAdicionar.setDisabled(false);
						dtEncerramento.setDisabled(false);
					} else {
						botaoIniciar.setVisible(true);
						botaoEncerrar.setVisible(false);	
						dtEncerramento.setDisabled(true);
					}
					
                    Ext.Array.each(concurso.inscricoes, function(inscricao, idx){
                        var row = {
							id: inscricao.id,
							nome: inscricao.magistrado.nome,
							matricula: inscricao.magistrado.matricula,
							prioridade: inscricao.magistrado.classificacao
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
        } 
    },
	
	onRemoverMagistradoConcurso : function(grid, rowIndex, colIndex, item, e, record) {
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja remover o participante?', Ext.Msg.QUESTION, function(){// ação ao confirmar

			var magistradoId = record.get('matricula');
			
			if(!magistradoId) {
				var grid = Ext.ComponentQuery.query('#gridGerenciarRecusa')[0];
				var gridStore = grid.getStore();
				gridStore.removeAt(rowIndex);							
				return;
			}
			
			var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RecusaID')[0];
			var recusaId = hiddenField.getValue();	

			hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RowID')[0];
			var escalaId = hiddenField.getValue();
			
			var gridAdministracao = Ext.getCmp('viewGerenciarRecusaSorteio');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Realizando ação...');
			}		
			
			var magistrado = {
				matricula: magistradoId
			};
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				magistrado: magistrado,
				idRecusa: recusaId,
				idEscala: escalaId
			};			

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/concurso/removerMagistradoAdm'
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
							var grid = Ext.ComponentQuery.query('#gridGerenciarRecusa')[0];
							var gridStore = grid.getStore();
							gridStore.removeAt(rowIndex);							
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
		
	}
  
});