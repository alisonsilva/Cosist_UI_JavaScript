Ext.define('Oficiais.view.administracao.AdministracaoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.administracaocontroller',
    requires: [
        'Ext.window.Window'    
    ],

    onRowClick: function(grid, record, tr, rowIndex, e, options){
        console.log('row clicked');
    },
    
    onExibeClassificacaoClick : function() {
        var me = this;
        
        var win2 = Ext.create('Ext.window.Window', {
            height: 650,
            width: 1100,
            x: 200,
            y: 100,
            title: 'Classificação',
            closable: true,
            plain: true,
            modal: true,
            layout: 'fit',
            items: [Ext.create('Oficiais.view.criterio.Criterio')]      
        });
        win2.show();
    },
    
    onRealizarSorteioClick : function() {
        var me = this;
        var win2 = Ext.create('Ext.window.Window', {
            height: 650,
            width: 1100,
            x: 200,
            y: 100,
            title: 'Sorteios',
            closable: true,
            plain: true,
            modal: true,
            layout: 'fit',
            items: [Ext.create('Oficiais.view.sorteio.Sorteio')]      
        });
        win2.show();
    },
    
    onChangeProcesso : function(dtfield, newValue, oldValue, eOpts) {
        this.onChange(1, newValue);
    },    
    
    onChangeDtIni : function(dtfield, newValue, oldValue, eOpts) {
        this.onChange(2, newValue);
    },
    
    onChangeDtFim : function(dtfield, newValue, oldValue, eOpts) {
        this.onChange(3, newValue);
    },
    
    onChangeDtResultado : function(dtfield, newValue, oldValue, eOpts) {
        this.onChange(4, newValue);
    },   
    
    onChangeDtConclusao : function(dtfield, newValue, oldValue, eOpts) {
        this.onChange(6, newValue);
    },   


    onChangeFl : function(dtfield, newValue, oldValue, eOpts) {
        this.onChange(5, oldValue);
    },    
    
    onChange : function(fieldChanged, valor) {
        var grid = Ext.ComponentQuery.query('#gridAdministracao')[0];
        var record = grid.getSelectionModel().getSelection()[0];        
        if (!record) {
            record = grid.getStore().getAt(0);
        }
        
        if(grid && grid.getEl()) {
            grid.getEl().mask();
        }
        
        var concursoId = record.get('concursoId');
        var numProcesso = fieldChanged == 1 ? valor : record.get('numProcesso');
        var qtdVagas = record.get('qtdVagas');
        var dtIniInscricao = fieldChanged == 2 ? valor : record.get('dtIniInscricao');
        var dtFimInscricao = fieldChanged == 3 ? valor : record.get('dtFimInscricao');
        var dtResultadoProvisorio = fieldChanged == 4 ? valor : record.get('dtResultadoProvisorio');
        var dtConclusao = fieldChanged == 6 ? valor : record.get('dtEncerramento');
        var flConcursoValido = fieldChanged == 5 ? valor : record.get('flConcursoValido');
        var concurso = {
            numProcesso: numProcesso,
            concursoId: concursoId,
            qtdVagas: qtdVagas,
            dataInicioInscricao: Ext.Date.format(dtIniInscricao, 'd/m/Y'),
            dataFimInscricao: Ext.Date.format(dtFimInscricao, 'd/m/Y'),
            dataResultadoProvisorio: Ext.Date.format(dtResultadoProvisorio, 'd/m/Y'),
            dataEncerramento: dtConclusao ? Ext.Date.format(dtConclusao, 'd/m/Y') : null,
            flConcursoValido: flConcursoValido,
            matriculaUsuario: localStorage.getItem('matricula'),
            passwd: Oficiais.util.JsonPUtil.senha
        };
            
        Oficiais.util.JsonPUtil.executaChamadaPostObjeto('https://tjdf199.tjdft.jus.br/cosist/servicos/oficiaisjustica/dadosbasicos/atualizaConcurso'
                    , concurso, null, {executaChamadaSuccess : function(result, obj){
                        grid.getEl().unmask();
                        var info = result.infoRetornoOficiaisJustica;
                        var codigo = info.codigo;
                        var mensagem = info.mensagem;
                        if(codigo != 0) {
                            record.reject();
                            Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao realizar alteração: ' + mensagem, Ext.Msg.ERROR, function(){});
                        } else {
                            record.commit();
                            var v = Ext.getCmp('viewAdministracao');                           
                            var t = new Ext.ToolTip({
                                anchor: 'bottom',
                                anchorToTarget: false,
                                targetXY: [v.getWidth() - 100, v.getHeight()],
                                title: 'Mensagem',
                                html: 'Dados salvos com sucesso',
                                hideDelay: 0,
                                closable: true
                            });
                            t.show();
                        }
                        
                    }, executaChamadaError : function(){
                        grid.getEl().unmask();
                        record.reject();
                        Oficiais.util.DeviceUtil.showAlertaConfirma('Erro', 'Erro ao executar chamada', Ext.Msg.ERROR, function(){});
                    }
        });             
          
         
    }
   
});