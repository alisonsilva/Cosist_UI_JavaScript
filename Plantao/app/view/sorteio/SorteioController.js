Ext.define('Plantao.view.sorteio.SorteioController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sorteiocontroller',
    requires: [
        'Ext.window.Window'    
    ],

    onRowClick: function( row, record, tr, rowIndex, e, eOpts ){
        var me = this;
        var win2 = Ext.create('Ext.window.Window', {
            height: 650,
            width: 1100,
            x: 200,
            y: 100,
            title: 'Resultado do sorteio',
            closable: true,
            plain: true,
            modal: true,
            layout: 'fit',
            items: [Ext.create('Plantao.view.resultado.ResultadoSorteio')]
        });
        win2.show();          
    },
    
    onNovoSorteioClick : function() {
        var me = this;
        var nomeUsuario = localStorage.getItem("nome_usuario");
        var matricula = localStorage.getItem("matricula");
        
        var gridConc = Ext.ComponentQuery.query('#gridAdministracao')[0];
        var nomeSorteio = Ext.ComponentQuery.query('#txtSorteio')[0].getValue();
		var descricaoSorteio = Ext.ComponentQuery.query('#txtDescricaoSorteio')[0].getValue();
        
		if(!nomeSorteio || !descricaoSorteio) {
			Plantao.util.DeviceUtil.showAlertaConfirma('Aviso', 'É necessário preencher dados do sorteio', Ext.Msg.INFO, function(){});
			return;
		}
        
        var objReq = {matriculaUsuario: matricula, 
                      passwd: Plantao.util.JsonPUtil.senha, 
                      nomeSorteio: nomeSorteio, 
					  descricaoSorteio: descricaoSorteio};
        
        var viewSorteio = Ext.getCmp('viewSorteio');
        if(viewSorteio) {
            viewSorteio.getEl().mask('Realizando sorteio...');
        }
        
        Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/realizaSorteio'
                    , objReq, null, {executaChamadaSuccess : function(result, obj){
                        if(viewSorteio) {
                            viewSorteio.getEl().unmask();
                        }
                        
                        var info = result.infoRetornoSorteioPlantao;
                        var codigo = info.codigo;
                        var mensagem = info.mensagem;
                        if(codigo != 0) {
                            Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao realizar sorteio: ' + mensagem, Ext.Msg.ERROR, function(){});
                        } else {
                            me.evtRendering(null);
							var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
							lstEscalas.fireEvent('rerender');
                        }                        
                    }, executaChamadaError : function(){
                        if(viewSorteio) {
                            viewSorteio.getEl().unmask();
                        }
                        Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});
                    }
        });         
    },
    
    onVisualizarSorteioCkick : function() {
        var me = this;
        var win2 = Ext.create('Ext.window.Window', {
            height: 650,
            width: 1100,
            x: 200,
            y: 100,
            title: 'Resultado do sorteio',
            closable: true,
            plain: true,
            modal: true,
            layout: 'fit',
            items: [Ext.create('Plantao.view.resultado.ResultadoSorteio')]
        });
        win2.show();    
    }, 
    
    onChangeFlPublicado : function(dtfield, rowIndex, checked, eOpts) {
		var me = this;
        var grid = Ext.ComponentQuery.query('#gridSorteio')[0];
        var record = grid.getStore().getAt(rowIndex);        
        if (!record) {
            record = grid.getStore().getAt(0);
        }
        
		var sorteioId = record.get('id');
		var flPublicado = checked;
		var nome = record.get('nome');
		var descricao = record.get('descricao');
		var flAtivo = record.get('flAtivo');
		var sorteio = {
			id: sorteioId,
			nome: nome,
			descricao: descricao,
			ativo: flAtivo,
			publicado: flPublicado
		};
		
		var chamada = {
			matriculaUsuario: localStorage.getItem("matricula"),
			passwd: Plantao.util.JsonPUtil.senha, 
			sorteio: sorteio			
		};
		
        var viewSorteio = Ext.getCmp('viewSorteio');
        if(viewSorteio) {
            viewSorteio.getEl().mask('Atualizando...');
        }

        Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/alteraSorteio'
                    , chamada, null, {executaChamadaSuccess : function(result, obj){
                        if(viewSorteio) {
                            viewSorteio.getEl().unmask();
                        }
                        
                        var info = result.infoRetornoSorteioPlantao;
                        var codigo = info.codigo;
                        var mensagem = info.mensagem;
                        if(codigo != 0) {
                            Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao alterar sorteio: ' + mensagem, Ext.Msg.ERROR, function(){});
                        } else {
                            me.evtRendering(null);
							var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
							lstEscalas.fireEvent('rerender');
                        }                        
                    }, executaChamadaError : function(){
                        if(viewSorteio) {
                            viewSorteio.getEl().unmask();
                        }
                        Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao alterar sorteio', Ext.Msg.ERROR, function(){});
                    }
        });         
		
    },
    
    onChangeFlAtivo : function(dtfield, rowIndex, checked, eOpts) {
		var me = this;
        var grid = Ext.ComponentQuery.query('#gridSorteio')[0];
        var record = grid.getStore().getAt(rowIndex);    
        if (!record) {
            record = grid.getStore().getAt(0);
        }
        
		var sorteioId = record.get('id');
		var flPublicado = record.get('flPublicado');
		var nome = record.get('nome');
		var descricao = record.get('descricao');
		var flAtivo = checked;
		var sorteio = {
			id: sorteioId,
			nome: nome,
			descricao: descricao,
			ativo: flAtivo,
			publicado: flPublicado
		};
		
		var chamada = {
			matriculaUsuario: localStorage.getItem("matricula"),
			passwd: Plantao.util.JsonPUtil.senha, 
			sorteio: sorteio			
		};
		
        var viewSorteio = Ext.getCmp('viewSorteio');
        if(viewSorteio) {
            viewSorteio.getEl().mask('Atualizando...');
        }

        Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/alteraSorteio'
                    , chamada, null, {executaChamadaSuccess : function(result, obj){
                        if(viewSorteio) {
                            viewSorteio.getEl().unmask();
                        }
                        
                        var info = result.infoRetornoSorteioPlantao;
                        var codigo = info.codigo;
                        var mensagem = info.mensagem;
                        if(codigo != 0) {
                            Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao alterar sorteio: ' + mensagem, Ext.Msg.ERROR, function(){});
                        } else {
                            me.evtRendering(null);
							var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
							lstEscalas.fireEvent('rerender');
                        }                        
                    }, executaChamadaError : function(){
                        if(viewSorteio) {
                            viewSorteio.getEl().unmask();
                        }
                        Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao alterar sorteio', Ext.Msg.ERROR, function(){});
                    }
        });   
    },
	
	onRemove : function(grid, rowIndex, colIndex, item, e, record) {
		var me = this;
		Plantao.util.DeviceUtil.showAlertaConfirmaCancela('Alerta', 'Tem certeza que deseja apagar o sorteio?', Ext.Msg.QUESTION, function(){// ação ao confirmar
			var grid = Ext.ComponentQuery.query('#gridSorteio')[0];
	//        var record = grid.getSelectionModel().getSelection()[0];     
			var record = grid.getStore().getAt(rowIndex);  
			if (!record) {
				record = grid.getStore().getAt(0);
			}
			
			var sorteioId = record.get('id');
			var flPublicado = record.get('flPublicado');
			var nome = record.get('nome');
			var descricao = record.get('descricao');
			var flAtivo = record.get('flAtivo');;
			var sorteio = {
				id: sorteioId,
				nome: nome,
				descricao: descricao,
				ativo: flAtivo,
				publicado: flPublicado
			};
			
			var chamada = {
				matriculaUsuario: localStorage.getItem("matricula"),
				passwd: Plantao.util.JsonPUtil.senha, 
				sorteio: sorteio			
			};
			
			var viewSorteio = Ext.getCmp('viewSorteio');
			if(viewSorteio) {
				viewSorteio.getEl().mask('Removendo...');
			}

			Plantao.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/removeSorteio'
						, chamada, null, {executaChamadaSuccess : function(result, obj){
							if(viewSorteio) {
								viewSorteio.getEl().unmask();
							}
							
							var info = result.infoRetornoSorteioPlantao;
							var codigo = info.codigo;
							var mensagem = info.mensagem;
							if(codigo != 0) {
								Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao alterar sorteio: ' + mensagem, Ext.Msg.ERROR, function(){});
							} else {
								me.evtRendering(null);
								var lstEscalas = Ext.ComponentQuery.query('#gridAdministracao')[0];
								lstEscalas.fireEvent('rerender');
							}                        
						}, executaChamadaError : function(){
							if(viewSorteio) {
								viewSorteio.getEl().unmask();
							}
							Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao alterar sorteio', Ext.Msg.ERROR, function(){});
						}
			});   
			
		}, function(){//ação ao cancelar
			
		});
	},
	
    evtRendering : function(view) {
		var me = this;
        var viewSorteio = Ext.getCmp('viewSorteio');
        if(viewSorteio) {
            viewSorteio.getEl().mask('Recuperando sorteios...');
        }
        Plantao.util.JsonPUtil.executaChamada(
            'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/sorteio/todosSorteios',
            null,
            {executaChamadaSuccess : function(result, obj){
                if(viewSorteio) {
                    viewSorteio.getEl().unmask();
                }
                
                var info = result.infoRetornoSorteioPlantao;
                var codigo = info.codigo;
                var mensagem = info.mensagem;
                
                if(codigo == 0) { 
					var sorteios = info.sorteios;

                    var grid = Ext.ComponentQuery.query('#gridSorteio')[0];
                    grid.setTitle('Sorteios realizados ');
                    var gridStore = grid.getStore();
                    gridStore.removeAll();
                    
                    Ext.Array.each(sorteios, function(sorteio, idx){
                        var dtSorteio = Ext.Date.parse(sorteio.dataStr, 'd/m/Y H:i:s');
                        
                        var row = {id: sorteio.id, 
                                   nome: sorteio.nome,
                                   descricao: sorteio.descricao,
                                   data: dtSorteio,
                                   flAtivo: sorteio.ativo,
                                   flPublicado: sorteio.publicado
                                   };
                        gridStore.add(row);                
                    });
                } else {
                    Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro: ' + mensagem, Ext.Msg.ERROR, function(){});                                
                }
            }, executaChamadaError: function(obj){
                if(viewSorteio) {
                    viewSorteio.getEl().unmask();
                }
                Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
            }
        });                
    },
	
	onDownloadEscalasSorteiosClick : function() {
		Plantao.util.JsonPUtil.downloadArquivo({
			url: 'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/relatorioTodasEscalas',
			method: 'GET',
			params: null
		});
	},
	
	onBaixarEscalasDoSorteioClick : function(grid, rowIndex, colIndex, item, e, record) {
		var grid = Ext.ComponentQuery.query('#gridSorteio')[0];
		var record = grid.getStore().getAt(rowIndex);  
		if (!record) {
			record = grid.getStore().getAt(0);
		}
		
		var sorteioId = record.get('id');
		
		
		Plantao.util.JsonPUtil.downloadArquivo({
			url: 'https://tjdf199.tjdft.jus.br/cosist/servicos/plantao/escala/relatorioEscalasPorSorteio',
			method: 'GET',
			params: [sorteioId]
		});
	}
   
});