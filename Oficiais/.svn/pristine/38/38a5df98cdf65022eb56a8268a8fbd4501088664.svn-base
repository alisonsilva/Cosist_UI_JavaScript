Ext.define('Oficiais.view.reserva.Reserva', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Oficiais.view.main.MainController',
        'Oficiais.view.main.MainModel',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Oficiais.util.DeviceUtil',
        'Oficiais.util.JsonPUtil'
    ],

    xtype: 'reserva-grid',
    controller: 'reservacontroller',
    title: 'Registrar pedido',
    tooltip: 'Registre um pedido em algum setor disponível e administre os seus registros',
    id: 'viewReservas',
    height: 650,
    layout: {
        type: 'border'
    },

    items: [{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridReserva',
        store: 'ReservaStore',
        stateful: true,
        collapsible: false,
		scrollable: true,
        multiSelect: false,
        bufferedRenderer: false,
        stateId: 'reservaGrid',
        height: 350,
        width: 750,
        title: 'Gerenciamento das reservas',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
                render: function(view) {
                    matricula = localStorage.getItem("matricula");
                    var concursoId = localStorage.getItem("concursoId");
                    Oficiais.util.JsonPUtil.executaChamada(
                        'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/interessesPorMatricula/' + matricula + '/' + concursoId,
                        null,
                        {executaChamadaSuccess : function(result, obj){
                            var info = result.infoRetornoOficiaisJustica;
                            var setores = info.interesses;

                            var grid = Ext.ComponentQuery.query('#gridReserva')[0];
                            var gridStore = grid.getStore();
                            gridStore.removeAll();
                            
                            Ext.Array.each(setores, function(setor, idx){
                                var row = {circunscricao: setor.nomeCircunscricao, 
                                           descricao: setor.nomeSetor, 
                                           qtd_disponivel: setor.qtdOficiaisALotar,
                                           qtd_reservas: setor.qtdReservas,
                                           preferencia: setor.prioridade,
                                           id: setor.setorKey};
                                gridStore.add(row);                
                            });
                        }, executaChamadaError: function(obj){
                            Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                        }
                    });                
                }
            }
        },
        items: [],
                
        columns: [
            {
                text: 'Preferência',
                width: 100,
                sortable: true,
                dataIndex: 'preferencia'
            },
            {
                text     : 'Circunscrição',
                flex     : 1,
                sortable : true,
                dataIndex: 'circunscricao'
            },
            {
                text     : 'Descrição',
                flex: 1,
                sortable : false,
                dataIndex: 'descricao'
            },
            {
                text: 'Disponível(is)',
                width: 100,
                sortable: true,
                dataIndex: 'qtd_disponivel'
            },
            {
                text: 'Pedidos',
                width: 80,
                sortable: true,
                dataIndex: 'qtd_reservas'
            }
        ],
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                text: '',
                itemId: 'addreserva',
                //glyph: 0xf067,
                iconCls: 'icon-add',
                tooltip: 'Nova reserva',
                handler : 'onReservaClick',
                tooltip : 'Nova reserva' 
            }, {
                text: '',
                itemId: 'removereserva',
                disabled: true,
                //glyph: 0xf068,
                iconCls: 'icon-remove',
                tooltip: 'Apaga reserva',
                handler: 'onRemoveReservaClick',
                tooltip: 'Remove a reserva'
            }, {
                text: '',
                itemId: 'moveRowCima',
                disabled: true,
                //glyph: 0xf062,
                iconCls: 'icon-up',
                handler: 'moveRowCimaClick',
                tooltip: 'Promove a reserva'
            }, {
                text: '',
                itemId: 'moveRowBaixo',
                disabled: true,
                //glyph: 0xf063,
                iconCls: 'icon-down',
                handler: 'moveRowBaixoClick',
                tooltip: 'Rebaixa a reserva'
            }]
        }],
        listeners: {
            selectionchange: function (view, selections, options) {
                var record = selections[0];
                var btnRemoveReserva = Ext.ComponentQuery.query('#removereserva')[0];
                var btnCima = Ext.ComponentQuery.query('#moveRowCima')[0];
                var btnBaixo = Ext.ComponentQuery.query('#moveRowBaixo')[0];
                if(record) {
                    btnRemoveReserva.setDisabled(false);
                    btnCima.setDisabled(false);
                    btnBaixo.setDisabled(false);
                } else {
                    btnRemoveReserva.setDisabled(true);
                    btnCima.setDisabled(true);
                    btnBaixo.setDisabled(true);
                }
            }
        }
    }]
});
