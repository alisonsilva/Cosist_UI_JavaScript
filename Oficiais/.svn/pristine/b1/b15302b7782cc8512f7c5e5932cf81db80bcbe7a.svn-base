/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Oficiais.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Oficiais.view.main.MainController',
        'Oficiais.view.main.MainModel',
        'Ext.tip.QuickTipManager'
    ],

    xtype: 'app-main',
    controller: 'main',
    viewModel: 'main',
    plugins: 'viewport',
    style: 'background: #F2F2F2;',
    config: {
        id: 'mainView'
    },
    
    layout: {
        type: 'border',
        align: 'center'
    },
    items: [{
        xtype: 'container',
        region: 'north',
        layout: {
            type: 'vbox',
            align: 'center'
        },
        margin: '5 0 5 0',
        items: [{
            xtype: 'image',
            src: 'resources/pictures/logo_tjdft.png',
            height: 35,
            width: 1200
        },{
            xtype: 'toolbar',
            itemId: 'toolbarNorth',
            html: '',
            width: 1200,
            height: 35,
            items:['->',{
                xtype: 'button',
                text: '',
                //glyph: 0xf05a,
                iconCls: 'icon-detail',
                alignTarget: 'center',
                dock: 'center',
                tooltip: 'Informações do procedimento',
                handler : function() {
                    var me = this;
                    var win2 = Ext.create('Ext.window.Window', {
                        height: 150,
                        width: 350,
                        x: 700,
                        y: 150,
                        title: 'Informações do procedimento de movimentação',
                        closable: true,
                        plain: true,
                        modal: true,
                        layout: 'fit',
                        items: [Ext.create('Oficiais.view.splash.Splash')]
                    });
                    win2.show()
                }
            },{
                xtype: 'button',
                text: 'Sair',
                textAlign: 'center',
                //glyph: 0xf08b,
                iconCls: 'icon-exit',
                alignTarget: 'right',
                dock: 'right',
                handler : function(){
                    Oficiais.util.DeviceUtil.showAlertaConfirmaCancela('Confirma', 'Tem certeza que deseja sair da aplicação?', Ext.Msg.QUESTION, function(){
                        // Remove the localStorage key/value
                        localStorage.removeItem('TutorialLoggedIn');
                        localStorage.removeItem('matricula');

                        // Remove Main View
                        var vw = Ext.getCmp('mainView');
                        vw.destroy();

                        // Add the Login Window
                        Ext.create({
                            xtype: 'login'
                        });             
                    }, function(){});
                }
            }],
            listeners : {
                scope: this,
                'click': function( toolbar, event, eOpts ) {
                    var me = this;
                    var win2 = Ext.create('Ext.window.Window', {
                        height: 450,
                        width: 350,
                        x: 200,
                        y: 200,
                        title: 'Sorteios',
                        closable: true,
                        plain: true,
                        modal: true,
                        layout: 'fit',
                        items: [Ext.create('Oficiais.view.splash.Splash')]
                    });
                    win2.show()
                }
            }
        }]
    },{
        xtype: 'container',
        region: 'center',
        heigth: 650,
        layout: {
            type: 'vbox',
            align: 'center'
        },
        items: [{
            xtype: 'tabpanel',
            itemId: 'main-center',
            width: 1200,
            scrollable: true,
			resizable: true,
            items:[]
        }]
    }]
});
