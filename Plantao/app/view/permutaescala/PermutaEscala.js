Ext.define('Plantao.view.permutaescala.FiltroAlteracaoEscala', {
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

    xtype: 'permuta-escala',
    controller: 'permutaescalacontroller',
    tooltip: 'Visualize o resultado do sorteio para o procedimento atual',
    id: 'viewPermutaEscala',
    
    layout: {
        type: 'border'
    },
    items: [{
		region: 'north',
		xtype: 'form',
		collapsed: false,
		collapsible: false,
		width: 430,
		itemId: 'formPermutaEscala',
		border: false,
		items: [{
			xtype: 'combo',
			itemId: 'cmbPermutaEscala_Magistrado',
			fieldLabel: 'Magistrado',
			queryMode: 'local',
			width: 400,
			valueField: 'id',
			padding: '10 10 1 10',
			displayField: 'nome',
			store: 'MagistradoStore',
			listeners:{
				select : 'cmbSelect'
			}
		},{
			xtype: 'hiddenfield',
			name: 'rowId',
			itemId: 'hiddenPermutaEscala_RowID',
			value: ''
		}],		
        listeners: {
			rerender : 'onReRender'
        }			
	},{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridPermutaEscala',
        store: 'PermutaEscalaStore',
        multiSelect: false,
		collapsible: false,
        frame: false,
        stateId: 'permutaEscalaGrid',
        height: '70%',
        width: 1100,
        title: 'Escalas para o magistrado',
        items: [],
                
        columns: [
            {
                text     : 'Magistrado',
                sortable : true,
                width: 250,
                dataIndex: 'nomeMagistrado',
                field: {
                    xtype: 'textfield',
                    listeners : {
                        change: 'onChangeProcesso'
                    }
                }
            }, {
                text     : 'Início',
                sortable : true,
                width: 100,
                flex: 1,
                dataIndex: 'dtInicio',
                renderer: Ext.util.Format.dateRenderer('D, d/m/Y'),
                field: {
                    xtype: 'datefield',
                    format: 'd/m/Y'
                }
            }, {
                text: 'Fim',
                width: 100,
                sortable: true,
                flex: 1,
                dataIndex: 'dtFim',
                renderer: Ext.util.Format.dateRenderer('D, d/m/Y'),
                field: {
                    xtype: 'datefield',
                    format: 'd/m/Y'
                }
            }, {
                text: 'Modalidade',
                width: 300,
                sortable: true,
                dataIndex: 'descModalidade',                
                field: {
                    xtype: 'textfield'                    
                }
            }, {
				xtype: 'actioncolumn',
				header: 'Ação',
				width: 120,
				align: 'center',
				items:[{
					icon: 'resources/pictures/change.png',
					tooltip: 'Permutar escala',
					handler: 'onConfirmarPermutaEscala',
					padding: '0 4 0 0'
				}]
			}
        ],		
	}]
});
