Ext.define('Plantao.view.escala.NovaEscala', {
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

    xtype: 'nova-escala',
    controller: 'novaescalacontroller',
    tooltip: 'Incluir escala',
    id: 'viewNovaEscala',
    
    layout: {
        type: 'border'
    },
    items: [{
		region: 'center',
		xtype: 'form',
		collapsed: false,
		collapsible: false,
		width: 430,
		itemId: 'formNovaEscala',
		border: false,
		items: [{
			xtype: 'combo',
			itemId: 'cmbNEscala_Sorteio',
			fieldLabel: 'Sorteio',
			width: '95%',
			queryMode: 'local',
			valueField: 'id',
			padding: '10 5 1 10',
			displayField: 'nome',
			store: 'SorteioStore',
		},{
			xtype: 'combo',
			itemId: 'cmbNEscala_Magistrado',
			fieldLabel: 'Magistrado',
			width: '95%',
			queryMode: 'local',
			valueField: 'id',
			padding: '10 5 1 10',
			displayField: 'nome',
			store: 'MagistradoStore',
		},{
			xtype: 'datefield',
			padding: '1 5 1 10',
			name: 'dataInicio',
			fieldLabel: 'De',
			itemId: 'dtNEscala_dtInicio'
		},{
			xtype: 'datefield',
			padding: '1 5 1 10',
			name: 'dataFim',
			fieldLabel: 'Até',
			itemId: 'dtNEscala_dtFim'
		},{
			xtype: 'combo',
			itemId: 'cmbNEscala_Modalidade',
			padding: '1 5 1 10',
			width: '95%',
			queryMode: 'local',
			valueField: 'id',
			displayField: 'modalidade',
			fieldLabel: 'Modalidade',
			store: 'ModalidadeStore'
		}],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: '',
                itemId: 'btnNovaEscalaCancela',
                iconCls: 'icon-cancel',
                tooltip: 'Cancelar rejeição',
                disabled: false,
                handler : 'onCancelarNovaEscalaClick'
            },{
                text: '',
                itemId: 'btnNovaEscalaConfirma',
                iconCls: 'icon-save',
                tooltip: 'Confirmar rejeição',
                disabled: false,
                handler : 'onConfirmarNovaClick'
            }]
        }],		
        listeners: {
			rerender : 'onReRenderNovaEscala'
        }			
	}],
	viewConfig: {
		enableTextSelection: false,
		listeners: {
		}
	}
});
