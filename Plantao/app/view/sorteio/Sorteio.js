Ext.define('Plantao.view.sorteio.Sorteio', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.ux.CheckColumn',
        'Ext.form.field.Checkbox',
        'Ext.window.MessageBox',
        'Plantao.view.main.MainController',
        'Plantao.view.main.MainModel',
        'Plantao.view.sorteio.SorteioController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Plantao.util.DeviceUtil',
        'Plantao.util.JsonPUtil',
        'Ext.Date'
    ],

    xtype: 'sorteio-grid',
    controller: 'sorteiocontroller',
    title: 'Sorteio',
	iconCls: 'icon-sorteio',
    tooltip: 'Gerenciamento dos sorteios',
    id: 'viewSorteio',
    
    layout: {
        type: 'border'
    },
    height: 650,
    items: [{
		region: 'center',
		xtype: 'form',
		defaults: {anchor: '100%'},
		items: [{
			xtype: 'textfield',
			padding: '10 5 1 10',
			name: 'sorteio',
			itemId: 'txtSorteio',
			fieldLabel: 'Sorteio',
			allowBlank: false
		},{
			xtype: 'textareafield',
			padding: '1 5 10 10',
			grow: true,
			name: 'sorteioDescricao',
			fieldLabel: 'Descrição',
			itemId: 'txtDescricaoSorteio'
		}],
		
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: '',
                itemId: 'btnNovoSorteio',
                iconCls: 'icon-plus',
                tooltip: 'Novo sorteio',
                handler : 'onNovoSorteioClick'
            }]
        }]
		
	},{
        region: 'south',
        xtype: 'gridpanel',
        itemId: 'gridSorteio',
        store: 'SorteioStore',
        multiSelect: false,
		collapsible: false,
        frame: false,
        stateId: 'setorGrid',
        height: '70%',
        width: 1100,
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
        title: 'Sorteios realizados',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
                render: 'evtRendering'
            }
        },
        items: [],
                
        columns: [
            {
                text     : 'Sorteio',
                sortable : true,
                width: 200,
                dataIndex: 'nome'
            }, {
                text     : 'Descrição',
                sortable : false,
                flex: 1,
                dataIndex: 'descricao'
            }, {
                text: 'Data',
                sortable: true,
				tooltip: 'Data de realização do sorteio',
                width: 200,
                dataIndex: 'data',
                renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
            }, {
                text: 'Ativo',
                width: 150,
                dataIndex: 'flAtivo',
				tooltip: 'Sorteios ativos entram na listagem dos relatórios',
                xtype: 'checkcolumn',
                listeners : {
                    checkchange: 'onChangeFlAtivo'
                }
            }, {
                text: 'Publicado',
                width: 150,
				tooltip: 'Sorteios publicados poderão ser visualizados pelos magistrados',
                dataIndex: 'flPublicado',
                xtype: 'checkcolumn',
                listeners : {
                    checkchange: 'onChangeFlPublicado'
                }
            }, {
				xtype: 'actioncolumn',
				header: 'Ação',
				width: 50,
				align: 'center',
				items:[{
					icon: 'resources/pictures/trash.png',
					tooltip: 'Remover sorteio',
					handler: 'onRemove'
				},{
					icon: 'resources/pictures/download.png',
					tooltip: 'Baixar plantões do sorteio',
					handler: 'onBaixarEscalasDoSorteioClick'
				}]
			}
        ],
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: '',
                itemId: 'btnDownloadEscalasSorteios',
                iconCls: 'icon-download',
                tooltip: 'Baixar listagem de plantões',
                handler : 'onDownloadEscalasSorteiosClick'
            }]
        }],
		
        listeners: {
            selectionchange: function (view, selections, options) {
                var record = selections[0];
                var visualisacao = Ext.ComponentQuery.query('#btnVisualizarSorteio')[0];

                if(record) {
                    visualisacao.setDisabled(false);
                } else {
                    visualisacao.setDisabled(true);
                }
            },
            rowdblclick : 'onRowClick'
        }
    }]
});
