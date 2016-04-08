Ext.define('Plantao.view.gerenciarrecusamagis.GerenciarRecusaMaigsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.gerenciarrecusamagiscontroller',
    requires: [
        'Ext.window.Window'    
    ],
    
    onRowClick : function() {
    },
	
	onAdicionarConcursandoClick : function() {
		var me = this;
		var hiddenConcurso = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_ConcursoID')[0];		
		var hiddenMagis = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_MatriculaMagisID')[0];
		var hiddenEscalaId = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RowID')[0];

		var gridAdministracao = Ext.getCmp('viewGerenciarRecusaMagisSorteio');
		if(gridAdministracao) {
			gridAdministracao.getEl().mask('Realizando ação...');
		}		
		
		var chamada = {
			matriculaUsuario: localStorage.getItem("matricula"),
			passwd: Plantao.util.JsonPUtil.senha, 
			matriculaMagistrado: localStorage.getItem("matricula"),
			idConcurso: hiddenConcurso.getValue()
		};			

		Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/magistrado/candidatarConcurso'
			, chamada, null, {executaChamadaSuccess : function(result, obj){
				if(gridAdministracao) {
					gridAdministracao.getEl().unmask();
				}
				
				var info = result.infoRetornoConcurso;
				var codigo = info.codigo;
				var mensagem = info.mensagem;
				if(codigo != 0) {
					Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
				} else {
					var vwFiltro = Ext.ComponentQuery.query('#gridGerenciarRecusaMagis')[0];
					vwFiltro.fireEvent('rerender', hiddenEscalaId.getValue(), hiddenMagis.getValue(), hiddenConcurso.getValue());											
				}
			}, executaChamadaError : function(){
				if(gridAdministracao) {
					gridAdministracao.getEl().unmask();
				}
				Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao realizar ação', Ext.Msg.ERROR, function(){});
			}
		});		
	},

		
    onRender : function(escalaId, matriculaMagis, concursoId) {
        var gridSetores = Ext.getCmp('viewGerenciarRecusaSorteio');
        if(gridSetores) {
            gridSetores.getEl().mask('Recuperando...');
        }
        
		var hiddenField = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_RowID')[0];
		hiddenField.setValue(escalaId);
		
		var hiddenConcurso = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_ConcursoID')[0];
		hiddenConcurso.setValue(concursoId);
		
		var hiddenMagis = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_MatriculaMagisID')[0];
		hiddenMagis.setValue(matriculaMagis);
		
		
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

				var grid = Ext.ComponentQuery.query('#gridGerenciarRecusaMagis')[0];
				var gridStore = grid.getStore();
				gridStore.removeAll();    
				
				if(!concurso) {
					return;
				}
				
				var dtEncerramento = Ext.ComponentQuery.query('#dtGerenciarRecusa_DtEncerramento')[0];
				
				dtEncerramento.setValue(Ext.Date.parse(concurso.dtFimStr, 'd/m/Y'));

				
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
    },
	
	onRemoverMagistradoMagisConcurso : function(grid, rowIndex, colIndex, item, e, record) {
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja remover o participante?', Ext.Msg.QUESTION, function(){// ação ao confirmar

			var magistradoId = record.get('matricula');
			var hiddenConcurso = Ext.ComponentQuery.query('#hiddenGerenciarRecusa_ConcursoID')[0];
			
			var gridAdministracao = Ext.getCmp('viewGerenciarRecusaMagisSorteio');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Realizando ação...');
			}		

			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				matriculaMagistrado: magistradoId,
				idConcurso: hiddenConcurso.getValue()
			};			

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/magistrado/removerCandidaturaConcurso'
					, chamada, null, {executaChamadaSuccess : function(result, obj){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						
						var info = result.infoRetornoConcurso;
						var codigo = info.codigo;
						var mensagem = info.mensagem;
						if(codigo != 0) {
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
						} else {
							var grid = Ext.ComponentQuery.query('#gridGerenciarRecusaMagis')[0];
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