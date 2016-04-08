Ext.define('Plantao.view.login.Login', {
    extend: 'Ext.window.Window',
    xtype: 'login',
    requires: [
        'Plantao.view.login.LoginController',
        'Ext.form.Panel',
        'Plantao.util.JsonPUtil',
        'Ext.tip.QuickTipManager'
    ],

    controller: 'login',
    bodyPadding: 10,
    title: 'Login',
    closable: false,
    autoShow: true,
    items: {
        xtype: 'form',
        reference: 'form',
        itemId: 'formLogin',
        items: [{
            xtype: 'textfield',
            name: 'username',
            itemId: 'txtUserName',
            fieldLabel: 'Usuário de rede',
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'password',
            itemId: 'txtSenha',
            inputType: 'password',
            fieldLabel: 'Senha',
            allowBlank: false,
            enableKeyEvents: true,
            listeners:{
                keypress: 'passwordKeyPressed'
            }
        }],
        buttons: [{
            text: 'Entrar',
            //glyph: 0xf090,
            iconCls: 'icon-enter',
            formBind: true,
            listeners: {
                click: 'onLoginClick'
            }
        }]
    }    
});