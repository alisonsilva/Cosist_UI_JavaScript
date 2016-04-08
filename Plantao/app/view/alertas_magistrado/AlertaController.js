Ext.define('Plantao.view.alertas_magistrado.AlertaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.alertacontroller_magistrado',
    requires: [
        'Ext.window.Window'    
    ],
	
	onRefreshClick : function() {
		var lstEscalas = Ext.ComponentQuery.query('#gridPermutasMagistrado')[0];
		lstEscalas.fireEvent('rerenderpermutas');
		
		var lstConcursos = Ext.ComponentQuery.query('#gridConcursosMagistrados')[0];
		lstConcursos.fireEvent('rerenderconcursos');
	},
	
	onConcorrerConcurso : function(grid, rowIndex, colIndex, item, e, record) {
		var win2 = Ext.create('Ext.window.Window', {
			height: 430,
			width: 550,
			x: 200,
			y: 100,
			title: 'Concurso',
			closable: true,
			plain: true,
			modal: true,
			id: 'windowAdministracaoRecusa',
			layout: 'fit',
			items: [Ext.create('Plantao.view.gerenciarrecusamagis.GerenciarRecusaMagis')]      
		});
		win2.show();
		var vwFiltro = Ext.ComponentQuery.query('#gridGerenciarRecusaMagis')[0];
		vwFiltro.fireEvent('rerender', record.get('id_escala'), record.get('matricula_magistrado'), record.get('concurso_id'));											
		
	},
	
	onAceitarPermuta : function(grid, rowIndex, colIndex, item, e, record) {
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja solicitar permuta?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var gridAdministracao = Ext.getCmp('viewAlertasMagistrado');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Executando ...');
			}	
			
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				idPermuta: record.get('id_permuta')			
			};				

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/magistrado/confirmaPermuta'
					, chamada, null, {executaChamadaSuccess : function(result, obj){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						
						var info = result.infoRetornoPermuta;
						var codigo = info.codigo;
						var mensagem = info.mensagem;
						if(codigo != 0) {
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
						} else {
							var lstEscalas = Ext.ComponentQuery.query('#gridPermutasMagistrado')[0];
							lstEscalas.fireEvent('rerenderpermutas');
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
	
	
	onRecusarPermuta : function(grid, rowIndex, colIndex, item, e, record) {
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja cancelar permuta?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var gridAdministracao = Ext.getCmp('viewAlertasMagistrado');
			if(gridAdministracao) {
				gridAdministracao.getEl().mask('Executando ...');
			}				
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				idPermuta: record.get('id_permuta')			
			};				

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/magistrado/removerPermuta'
					, chamada, null, {executaChamadaSuccess : function(result, obj){
						if(gridAdministracao) {
							gridAdministracao.getEl().unmask();
						}
						
						var info = result.infoRetornoPermuta;
						var codigo = info.codigo;
						var mensagem = info.mensagem;
						if(codigo != 0) {
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', mensagem, Ext.Msg.ERROR, function(){});
						} else {
							var lstEscalas = Ext.ComponentQuery.query('#gridPermutasMagistrado')[0];
							lstEscalas.fireEvent('rerenderpermutas');
							
							var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
							lstEscalas.fireEvent('refreshcomponent');							
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
	
	
	onReRenderPermutas : function() {
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
			
	},

    onReRenderConcursos : function() {
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
   
});