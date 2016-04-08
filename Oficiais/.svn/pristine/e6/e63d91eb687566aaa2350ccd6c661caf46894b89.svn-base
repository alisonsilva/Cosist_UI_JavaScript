Ext.define('Oficiais.view.splash.Splash', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Oficiais.view.main.MainController',
        'Oficiais.view.main.MainModel',
        'Oficiais.view.setor.SetorController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Oficiais.util.DeviceUtil',
        'Oficiais.util.JsonPUtil',
        'Ext.tip.QuickTipManager'
    ],

    controller: 'splashcontroller',
    title: 'Informações do concurso',
    id: 'viewSplash',
    
    layout: {
        type: 'border'
    },
    height: 450,
    style: 'background-color: #CEE3F6 !important;',
    items: [{
        region: 'center',
        xtype: 'container',
        itemId: 'cntSplash',
        height: 450,
        width: 350,
        html: '',
        items: [],
        listeners: {
            render: 'onRender'
        }
    }]
});
