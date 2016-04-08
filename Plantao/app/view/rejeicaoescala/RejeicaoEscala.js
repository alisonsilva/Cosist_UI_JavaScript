Ext.define('Plantao.view.rejeicaoescala.RejeicaoEscala', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Plantao.view.main.MainController',
        'Plantao.view.main.MainModel',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Plantao.util.DeviceUtil',
        'Plantao.util.JsonPUtil',
        'Ext.tip.QuickTipManager'
    ],

    xtype: 'rejeicao-escala-grid',
    controller: 'rejeicaoescalacontroller',
    tooltip: 'Recusar o plantão',
    id: 'viewRejeicaoEscala',
    
    layout: {
        type: 'border'
    },
    items: [{
		region: 'center',
		xtype: 'form',
		collapsed: false,
		collapsible: false,
		width: 430,
		itemId: 'formRejeicaoEscala',
		border: false,
		items: [{
			xtype: 'checkboxfield',
			itemId: 'chkRejeicao_Justificada',
			fieldLabel: 'Justificada?',
			padding: '10 10 1 10',
			queryMode: 'local',
			width: 400,
			checked: true,
			listeners: [{
				change: 'onChangeChk'
			}]
		},{
			xtype: 'textareafield',
			padding: '1 10 1 10',
			grow: true,
			width: 400,
			name: 'alteracaoDescricao',
			fieldLabel: 'Escreva a justificativa',
			itemId: 'txtRejeicao_Justificativa'
		},{
			xtype: 'hiddenfield',
			name: 'rowId',
			itemId: 'hiddenRejeicaoEscala_RowID',
			value: ''
		}],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: '',
                itemId: 'btnRejeicaoEscalaCancela',
                iconCls: 'icon-cancel',
                tooltip: 'Cancelar rejeição',
                disabled: false,
                handler : 'onCancelarRejeicaoClick'
            },{
                text: '',
                itemId: 'btnRejeicaoEscalaConfirma',
                iconCls: 'icon-save',
                tooltip: 'Confirmar rejeição',
                disabled: false,
                handler : 'onConfirmaRejeicaoClick'
            }]
        }],		
        listeners: {
			rerender : 'onReRender'
        }			
	}]
});
