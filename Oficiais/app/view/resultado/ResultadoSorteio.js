Ext.define('Oficiais.view.resultado.ResultadoSorteio', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Oficiais.view.main.MainController',
        'Oficiais.view.main.MainModel',
        'Oficiais.view.resultado.ResultadoSorteioController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Oficiais.util.DeviceUtil',
        'Oficiais.util.JsonPUtil',
        'Ext.tip.QuickTipManager'
    ],

    xtype: 'resultao-grid',
    controller: 'resultadosorteiocontroller',
    title: 'Resultado do sorteio',
    tooltip: 'Visualize o resultado do sorteio para o procedimento atual',
    id: 'viewResultadoSorteio',
    
    layout: {
        type: 'border'
    },
    height: 650,
    items: [{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridResultadoSorteio',
        store: 'ResultadoSorteioStore',
        multiSelect: false,
        frame: false,
        stateId: 'resultadoSorteioGrid',
        width: 750,
        title: 'Resultado do sorteio',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
                render: 'onRender'
            }
        },
        items: [],
               
        columns: [
			{
				text: 'Classificação',
				sortable: true,
				dataIndex: 'classificacao',
				width: 100
			},{
                text: 'Oficial de justiça',
                sortable: true,
                flex: 1,
                dataIndex: 'nomeOficial'
            },{
                text: 'Matrícula',
                sortable: true,
                width: 200,
                dataIndex: 'matriculaOficial'
            },{
				text: 'Circunscrição atual',
				sortable: true,
				width: 200,
				dataIndex: 'circunscricaoAtual'
			},{
				text: 'Setor atual',
				sortable: true,
				width: 200,
				dataIndex: 'setorAtual'
			},{
                text     : 'Circunscrição destino',
                sortable : true,
                dataIndex: 'nomeCircunscricao',
                width: 200
            },{
                text: 'Setor destino',
                flex: 1,
                sortable: false,
                dataIndex: 'nomeSetor'
            }
        ],
        
        dockedItems: [],
        listeners: {
            rowclick: 'onRowClick'
        }
    }]
});
