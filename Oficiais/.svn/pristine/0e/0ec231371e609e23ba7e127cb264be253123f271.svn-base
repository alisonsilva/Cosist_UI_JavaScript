Ext.define('Oficiais.view.administracao.Administracao', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.ux.CheckColumn',
        'Ext.form.field.Checkbox',
        'Ext.window.MessageBox',
        'Oficiais.view.main.MainController',
        'Oficiais.view.main.MainModel',
        'Oficiais.view.administracao.AdministracaoController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Oficiais.util.DeviceUtil',
        'Oficiais.util.JsonPUtil',
        'Ext.Date'
    ],

    xtype: 'administracao-grid',
    controller: 'administracaocontroller',
    title: 'Administração',
    id: 'viewAdministracao',
    
    layout: {
        type: 'border'
    },
    height: 650,
    items: [{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridAdministracao',
        store: 'ConcursoStore',
        multiSelect: false,
        frame: false,
        stateId: 'setorGrid',
        height: 650,
        width: 750,
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 2})],
        title: 'Procedimentos de movimentação disponíveis - clique na célula para alterar informação',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
                render: function(view) {
                    var gridAdministracao = Ext.getCmp('viewAdministracao');
                    if(gridAdministracao) {
                        gridAdministracao.getEl().mask();
                    }
                    Oficiais.util.JsonPUtil.executaChamada(
                        'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/concursos',
                        null,
                        {executaChamadaSuccess : function(result, obj){
                            if(gridAdministracao) {
                                gridAdministracao.getEl().unmask('Recuperando concursos...');
                            }
                            var info = result.infoRetornoOficiaisJustica;
                            var setores = info.concursos;

                            var grid = Ext.ComponentQuery.query('#gridAdministracao')[0];
                            var gridStore = grid.getStore();
                            gridStore.removeAll();
                            
                            Ext.Array.each(setores, function(concurso, idx){
                                var dtIni = Ext.Date.parse(concurso.dataInicioInscricao, 'd/m/Y');
                                var dtFim = Ext.Date.parse(concurso.dataFimInscricao, 'd/m/Y');
                                var dtResult = Ext.Date.parse(concurso.dataResultadoProvisorio, 'd/m/Y');
                                var dtEncerramento = null;
                                if(concurso.dataEncerramento ) {
                                    dtEncerramento = Ext.Date.parse(concurso.dataEncerramento, 'd/m/Y');
                                }
                                
                                var row = {concursoId: concurso.concursoId, 
                                           numProcesso: concurso.numProcesso, 
                                           qtdVagas: concurso.qtdVagas,
                                           dtIniInscricao: Ext.Date.format(dtIni, 'd/m/Y'),
                                           dtFimInscricao: Ext.Date.format(dtFim, 'd/m/Y'),
                                           dtResultadoProvisorio: Ext.Date.format(dtResult, 'd/m/Y'),
                                           dtEncerramento: dtEncerramento ? Ext.Date.format(dtEncerramento, 'd/m/Y') : null,
                                           flConcursoValido: concurso.flConcursoValido };
                                gridStore.add(row);                
                            });
                        }, executaChamadaError: function(obj){
                            if(gridAdministracao) {
                                gridAdministracao.getEl().unmask();
                            }
                            Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                        }
                    });                
                }
            }
        },
        items: [],
                
        columns: [
            {
                text     : 'Procedimento',
                sortable : true,
                width: 200,
                dataIndex: 'numProcesso',
                field: {
                    xtype: 'textfield',
                    listeners : {
                        change: 'onChangeProcesso'
                    }
                }
            }, {
                text     : 'Data de início',
                sortable : true,
                width: 200,
                flex: 1,
                dataIndex: 'dtIniInscricao',
                renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                field: {
                    xtype: 'datefield',
                    format: 'd/m/Y',
                    listeners : {
                        change: 'onChangeDtIni'
                    }
                }
            }, {
                text: 'Data de encerramento',
                width: 200,
                sortable: true,
                flex: 1,
                dataIndex: 'dtFimInscricao',
                renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                field: {
                    xtype: 'datefield',
                    format: 'd/m/Y',
                    listeners : {
                        change: 'onChangeDtFim'
                    }
                }
            }, {
                text: 'Data de resultado provisório',
                width: 250,
                sortable: true,
                dataIndex: 'dtResultadoProvisorio',
                renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                field: {
                    xtype: 'datefield',
                    format: 'd/m/Y',
                    listeners : {
                        change: 'onChangeDtResultado'
                    }
                }
            }, {
                text: 'Data de conclusão',
                width: 250,
                sortable: false,
                dataIndex: 'dtEncerramento',
                renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                field: {
                    xtype: 'datefield',
                    format: 'd/m/Y',
                    listeners : {
                        change: 'onChangeDtConclusao'
                    }
                }
            }, {
                text: 'Procedimento aberto',
                width: 150,
                dataIndex: 'flConcursoValido',
                xtype: 'checkcolumn',
                listeners : {
                    checkchange: 'onChangeFl'
                }
            }
        ],
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                text: '',
                itemId: 'btnClassificacaoFull',
                iconCls: 'icon-classificacao-completa',
                tooltip: 'Exibir classificação completa',
                disabled: true,
                handler : 'onExibeClassificacaoClick'
            },{
                text: '',
                itemId: 'btnSortear',
                iconCls: 'icon-sortear',
                tooltip: 'Novo sorteio',
                disabled: true,
                handler : 'onRealizarSorteioClick'
            }]
        }],
        listeners: {
            selectionchange: function (view, selections, options) {
                var record = selections[0];
                var classificacaoFull = Ext.ComponentQuery.query('#btnClassificacaoFull')[0];
                var sorteio = Ext.ComponentQuery.query('#btnSortear')[0];

                if(record) {
                    classificacaoFull.setDisabled(false);
                    sorteio.setDisabled(false);
                } else {
                    classificacaoFull.setDisabled(true);
                    sorteio.setDisabled(true);
                }
            },
            rowclick : 'onRowClick'
        }
    }]
});
