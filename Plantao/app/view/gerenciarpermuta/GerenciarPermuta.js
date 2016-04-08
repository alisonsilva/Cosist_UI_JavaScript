Ext.define('Plantao.view.gerenciarpermuta.GerenciarPermuta', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Plantao.view.main.MainController',
        'Plantao.view.main.MainModel',
        'Plantao.view.gerenciarpermuta.GerenciarPermutaController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Plantao.util.DeviceUtil',
        'Plantao.util.JsonPUtil',
        'Ext.tip.QuickTipManager'
    ],

    xtype: 'gerenciar-permuta-grid',
    controller: 'gerenciarpermutacontroller',
    title: 'Gerenciamento de permuta',
    id: 'viewGerenciarPermuta',
    
    layout: {
        type: 'border'
    },
    height: 650,
    items: [{
		region: 'north',
		xtype: 'form',
		itemId: 'formGerenciarPermuta',
		collapsed: false,
		collapsible: false,
		width: 430,
		border: false,
		items:[{
			xtype: 'textfield',
			padding: '1 5 1 10',
			width: 350,
			name: 'dtPedito',
			fieldLabel: 'Data do pedido',
			editable: false,
			itemId: 'dtGerenciarRecusa_Pedido'
		},{
			xtype: 'textfield',
			padding: '1 5 1 10',
			width: 350,
			name: 'txtMagistrado',
			fieldLabel: 'Magistrado',
			editable: false,
			itemId: 'txtGerenciarRecusa_Magistrado'
		},{
			xtype: 'hiddenfield',
			name: 'rowId',
			itemId: 'hiddenGerenciarRecusa_RowID',
			value: ''
		},{
			xtype: 'hiddenfield',
			name: 'permutaId',
			itemId: 'hiddenGerenciarRecusa_permutaId',
			value: ''
		}]
	},{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridGerenciarPermuta',
        store: 'MagistradoPermutaStore',
        multiSelect: false,
        frame: false,
        stateId: 'resultadoPermutaGrid',
        width: 750,
        title: 'Partes',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
				rerender: 'onRender'
            }
        },
        items: [],
               
        columns: [
			{
				text: 'Nome',
				sortable: true,
				dataIndex: 'nome',
				flex: 1
			},{
                text: 'Matrícula',
                sortable: false,
                width: 80,
                dataIndex: 'matricula'
            },{
                text: 'Início',
                width: 120,
                sortable: true,
                dataIndex: 'dt_inicio',
                renderer: Ext.util.Format.dateRenderer('D, d/m/Y')
            },{
                text: 'Fim',
                sortable: true,
                width: 120,
                dataIndex: 'dt_fim',
				renderer: Ext.util.Format.dateRenderer('D, d/m/Y')
            },{
                text: 'Modalidade',
                width: 300,
                sortable: true,
                dataIndex: 'desc_modalidade'
            },{
                text: 'Confirmado',
                width: 80,
				tooltip: 'A permuta foi confirmada pelo magistrado',
                dataIndex: 'fl_confirmado',
                xtype: 'checkcolumn',
				disabled: false,
				listeners : {
                    checkchange: 'onChangeFlConfirmado'
                }
            },{
				xtype: 'actioncolumn',
				header: 'Ação',
				width: 80,
				align: 'center',
				items:[{
					icon: 'resources/pictures/sino.png',
					tooltip: 'Reenviar notificação de permuta ao magistrado',
					handler: 'onReenviarNotificacaoPermuta',
					padding: '0 4 0 0'
				}]
			}
        ],
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: '',
                itemId: 'btnCancelarPermuta',
                iconCls: 'icon-trash',
                tooltip: 'Cancelar permuta',
                handler : 'onCancelarPermutaClick'
            }]
        }],
		
        listeners: {
            rerender: 'onRender'
        }
    }]
});
