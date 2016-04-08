Ext.define('Plantao.util.JsonPUtil', {
    requires: ['Ext.data.JsonP'],
    singleton: true,
    usuario: '',
    senha: '',
    grupos: [],
    token: '',
    qtdMinutos: 4,
    timestamp: null,
    tipo_alerta_nova_mensagem: 1,
    tipo_alerta_atualizacao_aplicacao: 2,
    tipo_alerta_nova_aplicacao: 3,
    tipo_alerta_remocao_aplicacao: 4,
//desenvolvimento local
//    urlBaseServicos: 'http://192.168.1.6/jazzforms/servicos/senchaService',
//    urlRecuperacaoArquivos: 'http://192.168.1.6/jazzforms/servicos/mensagemService/mensagem/anexoMensagemUsuario/',
//    urlRaizServicos: 'http://192.168.1.6/', 

//desenvolvimento local 2
//    urlBaseServicos: 'http://localhost:8080/jazzforms/servicos/senchaService',
//    urlRecuperacaoArquivos: 'http://localhost:8080/jazzforms/servicos/mensagemService/mensagem/anexoMensagemUsuario/',
//    urlRaizServicos: 'http://localhost:8080/', 

    
//desenvolvimento 
//    urlBaseServicos: 'http://172.17.84.145/jazzforms/servicos/senchaService',
//    urlRecuperacaoArquivos: 'http://172.17.84.145/jazzforms/servicos/mensagemService/mensagem/anexoMensagemUsuario/',
//    urlRaizServicos: 'http://172.17.84.145/', 
  
// producao
    urlRaizServicos: 'https://tjdf199.tjdft.jus.br/',
    urlRecuperacaoArquivos: 'https://tjdf199.tjdft.jus.br/jazzforms/servicos/mensagemService/mensagem/anexoMensagemUsuario/',
    urlBaseServicos:        'https://tjdf199.tjdft.jus.br/jazzforms/servicos/senchaService',
    urlBaseServicosCosist: 'https://tjdf199.tjdft.jus.br/cosist/servicos',

    recuperaCredenciais : function(callBack) {
        Plantao.util.DataBaseUtils.getValorParametro('CH_CR', function(valor){
            if(!Ext.isEmpty(valor)) {
                var tms = Ext.Date.now();
                var crd = '{lgn='+Plantao.util.JsonPUtil.usuario+',sn='+Plantao.util.JsonPUtil.senha+',tm=' + tms + '}';
                var key = CryptoJS.enc.Latin1.parse(valor);
                var iv  = CryptoJS.enc.Latin1.parse('a chave vem aqui');
                var padMsg = Plantao.util.JsonPUtil.padString(crd);
                var encrypte1 = CryptoJS.AES.encrypt(padMsg, key, { iv: iv, padding: CryptoJS.pad.NoPadding, mode: CryptoJS.mode.CBC});
                var cyphertext = encrypte1.ciphertext.toString(CryptoJS.enc.Base64);
                cyphertext = cyphertext.replace(/\+/g, '_p_') + '';
                callBack('?par=' + cyphertext);
            } else {
                console.log('Valor CH_CR não está definido');
            }
        });
    },
    
    padString : function(source) {
        var paddingChar = ' ';
        var size = 16;
        var x = source.length % size;
        var padLength = size - x;

        for (var i = 0; i < padLength; i++) {
            source += paddingChar;
        }
        return source;
    },
    
    recuperaNovoToken : function() {
        var dtAgora = new Date();
        var dtAnterior = new Date(Plantao.util.JsonPUtil.timestamp);
        var diff = dtAgora.getTime() - dtAnterior.getTime();
        var diffMin = diff /(1000*60);
        if (Ext.isEmpty(Plantao.util.JsonPUtil.token) || diffMin > Plantao.util.JsonPUtil.qtdMinutos) {
            return true;
        }
        return false;
    },
    
    validaAutenticacao : function(cbSuccess, cbError) {
        var info = null;
        if(Plantao.util.JsonPUtil.recuperaNovoToken()) {
            if(Ext.device.Connection.isOnline()) {
                Plantao.util.JsonPUtil.autenticaUsuario(Plantao.util.JsonPUtil.usuario, Plantao.util.JsonPUtil.senha, 
                {onAutenticaSuccess: function(result){
                    var info = result.infoRetornoUsuario;
                    if(info.codigo > 0) {
                        console.log('Erro ao validar autenticação do usuário: ' + info.codigo + ' - ' + info.mensagem);
                        cbError(info.mensagem);
                    } else {
                        cbSuccess(info.mensagem);
                    }
                }, onAutenticaUsuarioError: function(){
                    Ext.Viewport.unmask();
                    console.log('Erro ao validar a autenticação');
                }});
            } else {
                cbError('rede está inativa');
            }
        } else {
            cbSuccess('');
        }
    },
    
    autenticaUsuario : function(usuario, senha, controller) {
    	Plantao.util.JsonPUtil.usuario = usuario;
    	Plantao.util.JsonPUtil.senha = senha;
        var objUsuario = {lgn: usuario, sn: senha};
        
        var urlPublicaFormulario = Plantao.util.JsonPUtil.urlBaseServicos + '/usuario/userByLogin';
        Ext.Ajax.request({
            url: urlPublicaFormulario,
            headers: { 'Content-Type': 'application/json' },   
            method: 'POST',
            jsonData: objUsuario,
            timeout: 60000,
            success: function(result) {
                var rst = Ext.JSON.decode(result.responseText);
                var info = rst.infoRetornoUsuario;
                if(!Ext.isEmpty(info)) {
                    if(info.codigo == 0) {
                        Plantao.util.JsonPUtil.token = info.token;
                        Plantao.util.JsonPUtil.timestamp = Ext.Date.now();
                    }
                }
                controller.onAutenticaSuccess(rst);
            },
            failure: function() {
                controller.onAutenticaUsuarioError();
            }
        });
    },    
    
    permissoesUsuario : function(login, objCallback) {

        Plantao.util.JsonPUtil.validaAutenticacao(function (msg) {
            var urlAutenticacao = Plantao.util.JsonPUtil.urlBaseServicos  + '/usuario/permisoesByLogin';
            var request = {token: Plantao.util.JsonPUtil.token, lgn: login};
            Ext.Ajax.request({
                url: urlAutenticacao,
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                jsonData: request,
                timeout: 60000,
                success: function (result) {
                    var rst = Ext.JSON.decode(result.responseText);
                    objCallback.resultPermissoesUsuario(rst);
                },
                failure: function() {
                    objCallback.resultPermissoesUsuarioError();
                }
            });
        }, function(msg){Plantao.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao recuperar formulários', function(){});});
    },

    executaChamada : function(caminhoChamada, obj, objCallBack) {
        var urlDet = caminhoChamada + '.jsonp';
            
        Ext.data.JsonP.request({
            url: urlDet,
            timeout: 60000,
            callbackKey : 'callback',
            success: function(result) {
                if(!Ext.isEmpty(result.responseText)) {
                    result = Ext.JSON.decode(result.responseText);
                }                    
                objCallBack.executaChamadaSuccess(result, obj);
            },
            failure: function() {
                objCallBack.executaChamadaError(obj);
            }
        });
    },

    executaChamadaPostObjeto : function(caminhoChamada, objPost, obj, objCallBack) {
        var urlRequest = caminhoChamada + '.jsonp';
        var request = objPost;               
        Ext.Ajax.request({
            url: urlRequest,
            headers: { 'Content-Type': 'application/json' },   
            method: 'POST',
            timeout: 60000,
            jsonData: request,
            success: function(result) {
                if(!Ext.isEmpty(result.responseText)) {
                    result = Ext.JSON.decode(result.responseText);
                }                    
                objCallBack.executaChamadaSuccess(result, obj);
            },
            failure: function(result) {
                objCallBack.executaChamadaError(obj);
            }
        });
    },
	
	downloadArquivo : function(config) {
		if(config.params) {
			var request = '';
			Ext.Array.each(config.params, function(param, idx){
				request += param + '/';
			});
			window.open(config.url + '/' + request);
		} else {
			window.open(config.url);			
		}		
	}
});