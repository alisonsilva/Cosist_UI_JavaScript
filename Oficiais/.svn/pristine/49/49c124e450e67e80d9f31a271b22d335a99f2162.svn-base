Ext.define('Oficiais.view.sorteio.Sorteio', {
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
        'Oficiais.view.sorteio.SorteioController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Oficiais.util.DeviceUtil',
        'Oficiais.util.JsonPUtil',
        'Ext.Date'
    ],

    xtype: 'sorteio-grid',
    controller: 'sorteiocontroller',
    title: 'Sorteios',
    tooltip: 'Visualize o resultado do sorteio para o procedimento atual',
    id: 'viewSorteio',
    
    layout: {
        type: 'border'
    },
    height: 650,
    items: [{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridSorteio',
        store: 'SorteioStore',
        multiSelect: false,
        frame: false,
        stateId: 'setorGrid',
        height: 650,
        width: 1100,
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
        title: 'Informações sobre os sorteios - clique na célula para alterar informação',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
                render: 'evtRendering'
            }
        },
        items: [],
                
        columns: [
            {
                text     : 'Usuário responsável',
                sortable : true,
                flex: 1,
                dataIndex: 'nomeUsuario'
            }, {
                text     : 'Matrícula',
                sortable : true,
                width: 150,
                dataIndex: 'matriculaUsuario'
            }, {
                text: 'Data do sorteio',
                sortable: true,
                width: 200,
                dataIndex: 'dhSorteio',
                renderer: Ext.util.Format.dateRenderer('d/m/Y H:i:s')
            }, {
                text: 'Publicar resultado',
                width: 150,
                dataIndex: 'flPublicado',
                xtype: 'checkcolumn',
                listeners : {
                    checkchange: 'onChangeFlPublico'
                }
            }
        ],
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: '',
                itemId: 'btnNovoSorteio',
                iconCls: 'icon-add',
                tooltip: 'Novo sorteio',
                handler : 'onNovoSorteioClick'
            },{
                text: '',
                itemId: 'btnVisualizarSorteio',
                iconCls: 'icon-eye',
                disabled: true,
                tooltip: 'Visualiar sorteio',
                handler: 'onVisualizarSorteioCkick'
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
