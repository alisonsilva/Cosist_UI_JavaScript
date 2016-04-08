Ext.define('Oficiais.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onLoginClick: function() {
        var me = this;
        var usr = Ext.ComponentQuery.query('#txtUserName')[0].getValue();
        var pssword = Ext.ComponentQuery.query('#txtSenha')[0].getValue();
        
        Oficiais.util.JsonPUtil.autenticaUsuario(usr, pssword, { onAutenticaSuccess: function(result){
            var infoRetornoUsuario = result.infoRetornoUsuario;
            var codigoLogin = infoRetornoUsuario.codigo;
            var mensagem = infoRetornoUsuario.mensagem;
            
            var loginForm = Ext.ComponentQuery.query('#formLogin')[0];
            if(loginForm && loginForm.getEl()) {
                loginForm.getEl().mask();
            }
            
            if(codigoLogin === 0) {
                Oficiais.util.JsonPUtil.usuario = Ext.ComponentQuery.query('#txtUserName')[0].getValue();
                Oficiais.util.JsonPUtil.senha   = Ext.ComponentQuery.query('#txtSenha')[0].getValue();
                localStorage.setItem('matricula', Oficiais.util.JsonPUtil.usuario);
            
                
                var usuario = infoRetornoUsuario.usuario;
                Oficiais.util.JsonPUtil.executaChamada(
                    'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/ultimoConcursoValido',
                    null,
                    {executaChamadaSuccess : function(result1, obj){
                        var infoUC = result1.infoRetornoOficiaisJustica;
                        var codigoUC = infoUC.codigo;
                        var mensagemUC = infoUC.mensagem;
                        var matricula = localStorage.getItem('matricula');
                        if(codigoUC == 0) {
                            var concurso = infoUC.ultimoConcursoValido;                            
                            Oficiais.util.JsonPUtil.executaChamada(
                                'https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/isOficialJusticaAtivo/'+matricula,
                                null,
                                {executaChamadaSuccess : function(result2, obj){
                                    if(loginForm && loginForm.getEl()) {
                                        loginForm.getEl().unmask();
                                    }            
                                    var infoOJ = result2.infoRetornoOficiaisJustica;
                                    var codigoOJ = infoOJ.codigo;
                                    var mensagemOJ = infoOJ.mensagem;
                                    if(codigoOJ == 0) {
                                        var isOficial = infoOJ.isOficialJustica;
                                        me.montaPagina(usuario, concurso, isOficial);
                                    } else {
                                        Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao recuperar oficial de justiça: ' + mensagemOJ, Ext.Msg.Error, function(){ });
                                    }
                                }, executaChamadaError: function(obj){
                                    if(loginForm && loginForm.getEl()) {
                                        loginForm.getEl().unmask();
                                    }            
                                    Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                                }
                            });                    
                        
                        } else {
                            if(loginForm && loginForm.getEl()) {
                                loginForm.getEl().unmask();
                            }            
                            Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao recuperar concurso: ' + mensagemUC, Ext.Msg.Error, function(){ });
                        }
                    }, executaChamadaError: function(obj){
                        if(loginForm && loginForm.getEl()) {
                            loginForm.getEl().unmask();
                        }            
                        Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});                        
                    }
                });                    
            } else if(codigoLogin === 13) {
                if(loginForm && loginForm.getEl()) {
                    loginForm.getEl().unmask();
                }            
                Oficiais.util.DeviceUtil.showAlertaConfirma('Aviso', 'O usuário está inativado', Ext.Msg.WARNING, function(){ });                
            } else {
                if(loginForm && loginForm.getEl()) {
                    loginForm.getEl().unmask();
                }            
                Oficiais.util.DeviceUtil.showAlertaConfirma('Aviso', 'Usuário ou senha inválido', Ext.Msg.WARNING, function(){ });
            }
        }, onAutenticaUsuarioError : function(){
            Oficiais.util.DeviceUtil.showAlertaConfirma('Aviso', 'Erro ao executar autenticação', Ext.Msg.WARNING, function(){ });
        }});
    },
    
    passwordKeyPressed : function(passwd, e, eo) {
        if(e.getCharCode() == Ext.EventObject.ENTER) {
            this.onLoginClick();
        }
    },
    
    montaPagina : function(usuario, concurso, isOficial) {
        var me = this;
        var concursoId = null;
        
        if (!concurso) {    
            Oficiais.util.DeviceUtil.showAlertaConfirma('Aviso', 'Não há concurso aberto', Ext.Msg.Warning, function(){ });
        } else {
            localStorage.setItem('concursoId', concurso.concursoId);
            localStorage.setItem('processoConcurso', concurso.numProcesso);
            concursoId = concurso.concursoId;
        }
        Oficiais.util.JsonPUtil.grupos = [];
        if (usuario != null) {
            var idx = 0;
            Ext.each(usuario.grupos, function(grupo) {
                var grp = {nome: grupo.nome};
                Ext.Array.include(Oficiais.util.JsonPUtil.grupos, grp);
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
        
        Oficiais.util.DeviceUtil.setCabecalho();
        
        var center = Ext.ComponentQuery.query('#main-center')[0];

        var isSecretariaAdmin = Oficiais.util.DeviceUtil.isInGrupo(Oficiais.util.JsonPUtil.grupos, ['SecretariaGeralCorregedoria_Oficiais']);

        if(isSecretariaAdmin) {
            var admin = Ext.create('Oficiais.view.administracao.Administracao');
            center.add(admin);
        }
        if(concursoId > 0) {
        
            var setores = Ext.create('Oficiais.view.setor.Setor');
            center.add(setores);
            if(isOficial) {
                var reservas = Ext.create('Oficiais.view.reserva.Reserva');
                center.add(reservas);
            }
			if(concurso.hasSorteioValido) {
				var sorteio = Ext.create('Oficiais.view.resultado.ResultadoSorteio');
				center.add(sorteio);
			}
            var ranking = Ext.create('Oficiais.view.ranking.Ranking');
            center.add(ranking);                            
        } 

        center.doLayout();
    
    }
});