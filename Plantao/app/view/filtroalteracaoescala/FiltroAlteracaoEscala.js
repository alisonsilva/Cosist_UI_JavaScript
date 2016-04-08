Ext.define('Plantao.view.filtroalteracaoescala.FiltroAlteracaoEscala', {
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

    xtype: 'filtro-alteracao-escala-grid',
    controller: 'filtroalteracaoescalacontroller',
    tooltip: 'Visualize o resultado do sorteio para o procedimento atual',
    id: 'viewFiltroAlteracaoEscala',
    
    layout: {
        type: 'border'
    },
    items: [{
		region: 'center',
		xtype: 'form',
		collapsed: false,
		collapsible: false,
		width: 430,
		itemId: 'formFiltroAlteracaoEscala',
		border: false,
		items: [{
			xtype: 'combo',
			itemId: 'cmbFiltroAlteracao_Magistrado',
			fieldLabel: 'Magistrado',
			queryMode: 'local',
			width: 400,
			valueField: 'id',
			padding: '10 10 1 10',
			displayField: 'nome',
			store: 'MagistradoStore',
		},{
			xtype: 'textareafield',
			padding: '1 10 1 10',
			grow: true,
			width: 400,
			name: 'alteracaoDescricao',
			fieldLabel: 'Justificativa',
			itemId: 'txtFiltroAlteracao_Justificativa'
		}/*,{
			xtype: 'datefield',
			padding: '1 10 1 10',
			name: 'dataInicio',
			fieldLabel: 'Data inicial',
			disabled: true,
			itemId: 'txtFiltroAlteracao_dtInicio'
		},{
			xtype: 'datefield',
			padding: '1 10 1 10',
			name: 'dataFim',
			fieldLabel: 'Data final',
			disabled: true,
			itemId: 'txtFiltroAlteracao_dtFim'
		},{
			xtype: 'combo',
			itemId: 'cmbFiltroAlteracao_Modalidade',
			padding: '1 10 1 10',
			queryMode: 'local',
			width: 400,
			valueField: 'id',
			disabled: true,
			displayField: 'modalidade',
			fieldLabel: 'Modalidade',
			store: 'ModalidadeStore'
		}*/,{
			xtype: 'hiddenfield',
			name: 'rowId',
			itemId: 'hiddenFiltroAlteracao_RowID',
			value: ''
		}],
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: '',
                itemId: 'btnAlteracaoEscalaCancela',
                iconCls: 'icon-cancel',
                tooltip: 'Cancelar alteração',
                disabled: false,
                handler : 'onCancelarAlteracaoClick'
            },{
                text: '',
                itemId: 'btnAlteracaoEscalaConfirma',
                iconCls: 'icon-save',
                tooltip: 'Confirmar alteração',
                disabled: false,
                handler : 'onConfirmaAlteracaoClick'
            }]
        }],		
        listeners: {
			rerender : 'onReRender'
        }			
	}]
});
