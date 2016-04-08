Ext.define('Plantao.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onLoginClick: function() {
        var me = this;
        var usr = Ext.ComponentQuery.query('#txtUserName')[0].getValue();
        var pssword = Ext.ComponentQuery.query('#txtSenha')[0].getValue();
        
        Plantao.util.JsonPUtil.autenticaUsuario(usr, pssword, { onAutenticaSuccess: function(result){
            var infoRetornoUsuario = result.infoRetornoUsuario;
            var codigoLogin = infoRetornoUsuario.codigo;
            var mensagem = infoRetornoUsuario.mensagem;
            
           
            if(codigoLogin === 0) {
                Plantao.util.JsonPUtil.usuario = Ext.ComponentQuery.query('#txtUserName')[0].getValue();
                Plantao.util.JsonPUtil.senha   = Ext.ComponentQuery.query('#txtSenha')[0].getValue();
                localStorage.setItem('matricula', Plantao.util.JsonPUtil.usuario);
            
				var usuario = infoRetornoUsuario.usuario;
                
				me.montaPagina(usuario);
            } else if(codigoLogin === 13) {
                if(loginForm && loginForm.getEl()) {
                    loginForm.getEl().unmask();
                }            
                Plantao.util.DeviceUtil.showAlertaConfirma('Aviso', 'O usuário está inativado', Ext.Msg.WARNING, function(){ });                
            } else {
                if(loginForm && loginForm.getEl()) {
                    loginForm.getEl().unmask();
                }            
                Plantao.util.DeviceUtil.showAlertaConfirma('Aviso', 'Usuário ou senha inválido', Ext.Msg.WARNING, function(){ });
            }
        }, onAutenticaUsuarioError : function(){
            Plantao.util.DeviceUtil.showAlertaConfirma('Aviso', 'Erro ao executar autenticação', Ext.Msg.WARNING, function(){ });
        }});
    },
    
    passwordKeyPressed : function(passwd, e, eo) {
        if(e.getCharCode() == Ext.EventObject.ENTER) {
            this.onLoginClick();
        }
    },
    
    montaPagina : function(usuario) {
        var me = this;

        Plantao.util.JsonPUtil.grupos = [];
        if (usuario != null) {
            var idx = 0;
            Ext.each(usuario.grupos, function(grupo) {
                var grp = {nome: grupo.nome};
                Ext.Array.include(Plantao.util.JsonPUtil.grupos, grp);
            });
        }       
        localStorage.setItem('nome_usuario', usuario.nome);
        Ext.tip.QuickTipManager.init();

        // Remove Login Window
        me.getView().destroy();

        // Add the main view to the viewport
        var mainView = Ext.create({
            xtype: 'app-main'
        });
        
        Plantao.util.DeviceUtil.setCabecalho();
        
        var center = Ext.ComponentQuery.query('#main-center')[0];

        var isSecretariaAdmin = Plantao.util.DeviceUtil.isInGrupo(Plantao.util.JsonPUtil.grupos, ['Corregedoria_Plantao']);
		var isMagistradoPlantao = Plantao.util.DeviceUtil.isInGrupo(Plantao.util.JsonPUtil.grupos, ['Magistrados_Plantao']);

        if(isMagistradoPlantao) {
            var admin = Ext.create('Plantao.view.administracao_magistrado.Administracao');
			var alerta = Ext.create('Plantao.view.alertas_magistrado.Alerta');
            center.add(admin);
			center.add(alerta);
		} else if(isSecretariaAdmin) {
            var admin = Ext.create('Plantao.view.administracao.Administracao');
			var sorteio = Ext.create('Plantao.view.sorteio.Sorteio');
            center.add(admin);
			center.add(sorteio);
        }

        center.doLayout();
    
    }
});