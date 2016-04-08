Ext.define('Plantao.view.splash.Splash', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Plantao.view.main.MainController',
        'Plantao.view.main.MainModel',
        'Plantao.view.setor.SetorController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Plantao.util.DeviceUtil',
        'Plantao.util.JsonPUtil',
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
