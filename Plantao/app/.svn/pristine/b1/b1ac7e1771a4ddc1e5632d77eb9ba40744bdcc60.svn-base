Ext.define('Plantao.util.DeviceUtil', {
    singleton: true,
    scope: this,
    fileName: '',
    projectId: 'tjdft-gc-01',
    projectNumber: '700045213591',    
    novoAlertaEncaminhado: null,
    
    isInGrupo : function(grupos, nomeGrupos) {
        var isingrp = false;
        Ext.Array.each(grupos, function(grupo){
            Ext.Array.each(nomeGrupos, function(nome){
                if(grupo.nome == nome) {
                    isingrp = true;
                }
            });
        });
        return isingrp;
    },
    
    setCabecalho : function() {
        var nomeUsuario = localStorage.getItem("nome_usuario");
        var processo = localStorage.getItem('processoConcurso');
        var bar = Ext.ComponentQuery.query('#toolbarNorth')[0];
        var html = "<div style=\'width: 95%; margin: auto; padding: 0; display: table; border: 0px;  font-size: 13px; text-align: left; color: #666666; padding-left: 5px; padding-bottom: 5px; line-height: 92%;\'> "
            +"    <div style=\'display: table-row; \'> "
            +"        <div style=\'width: 45%; padding-left: 0.5em; padding-top: 0.7em; display: table-cell;  font-size: 13px; color: #666666;\'>"+nomeUsuario+"</div>"
            +"    </div> "
            +"</div>";
        bar.setHtml(html);  
    },
    
    showAlertaConfirma : function(tituloAlerta, mensagemAlerta, icone, funcaoOk) {
        Ext.Msg.show({
            title: tituloAlerta,
            message: mensagemAlerta,
            buttons: Ext.MessageBox.OK,
            icon: icone,
            fn: function(button) {
                if(button === 'ok') {        	
                    funcaoOk();
                }
            }
        });    
    },
       
    showAlertaConfirmaCancela : function(tituloAlerta, mensagemAlerta, icone, funcaoOk, funcaoCancel) {
    
        Ext.Msg.show({
            title: tituloAlerta,
            message: mensagemAlerta,
            buttons: Ext.MessageBox.OKCANCEL,
            icon: icone,
            fn: function(button) {
                if(button === 'ok') {        	
                    funcaoOk();
                } else {
                    funcaoCancel();
                }
            }
        });    
    }
    
});