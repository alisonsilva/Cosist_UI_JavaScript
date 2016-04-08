Ext.define('Plantao.view.gerenciarrecusa.GerenciarRecusa', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Plantao.view.main.MainController',
        'Plantao.view.main.MainModel',
        'Plantao.view.gerenciarrecusa.GerenciarRecusaController',
        'Ext.grid.column.Action',
        'Ext.window.MessageBox',
        'Plantao.util.DeviceUtil',
        'Plantao.util.JsonPUtil',
        'Ext.tip.QuickTipManager'
    ],

    xtype: 'gerenciar-recusa-grid',
    controller: 'gerenciarrecusacontroller',
    title: 'Gerenciamento de recusa',
    id: 'viewGerenciarRecusaSorteio',
    
    layout: {
        type: 'border'
    },
    height: 650,
    items: [{
		region: 'north',
		xtype: 'form',
		itemId: 'formGerenciarRecusa',
		collapsed: false,
		collapsible: false,
		width: 430,
		border: false,
		items:[{
			xtype: 'textfield',
			padding: '1 5 1 10',
			width: 400,
			name: 'dtPedito',
			fieldLabel: 'Data do pedido',
			editable: false,
			itemId: 'dtGerenciarRecusa_Pedido'
		},{
			xtype: 'textfield',
			padding: '1 5 1 10',
			name: 'txtMagistrado',
			width: 400,
			fieldLabel: 'Magistrado',
			editable: false,
			itemId: 'txtGerenciarRecusa_Magistrado'
		},{
			xtype: 'checkbox',
			padding: '1 5 1 10',
			name: 'chkJustificado',
			fieldLabel: 'Justificado',
			disabled: true,
			itemId: 'chkGerenciarRecusa_Justificado'
		},{
			xtype: 'textarea',
			padding: '1 5 1 10',
			grow: true,
			width: 400,
			name: 'txtJustificativa',
			fieldLabel: 'Justificativa',
			editable: false,
			itemId: 'txtGerenciarRecusa_Justificativa'
		},{
			xtype: 'datefield',
			padding: '1 5 1 10',
			name: 'dtDataFinalConcurso',
			fieldLabel: 'Encerramento',
			disabled: true,
			itemId: 'dtGerenciarRecusa_DtEncerramento',
			listeners: [{
				change: 'onChangeDtEncerramento'
			}]
		},{
			xtype: 'hiddenfield',
			name: 'rowId',
			itemId: 'hiddenGerenciarRecusa_RowID',
			value: ''
		},{
			xtype: 'hiddenfield',
			name: 'recusaId',
			itemId: 'hiddenGerenciarRecusa_RecusaID',
			value: ''
		}]
	},{
        region: 'center',
        xtype: 'gridpanel',
        itemId: 'gridGerenciarRecusa',
        store: 'MagistradoConcursoStore',
        multiSelect: false,
        frame: false,
        stateId: 'resultadoRecusaGrid',
        width: 750,
		plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
        title: 'Concurso',
        viewConfig: {
            enableTextSelection: false,
            listeners: {
				rerender: 'onRender'
            }
        },
        items: [],
               
        columns: [
			{
				text: 'Nome',
				sortable: true,
				dataIndex: 'nome',
				flex: 1,
				editor: {
                    xtype: 'combobox',
                    valueField: 'nome',
					displayField: 'nome',
                    queryMode: 'local',
                    store: 'MagistradoStore',
					listeners:{
						select : 'cmbSelecionarMagistradoSelect',						
					}
                }
			},{
                text: 'Matrícula',
                sortable: false,
                width: 150,
                dataIndex: 'matricula'
            },{
                text: 'Prioridade',
                sortable: true,
                width: 80,
                dataIndex: 'prioridade'
            },{
				xtype: 'actioncolumn',
				header: 'Ação',
				width: 80,
				align: 'center',
				items:[{
					icon: 'resources/pictures/trash.png',
					tooltip: 'Remover magistrado',
					handler: 'onRemoverMagistradoConcurso',
					padding: '0 4 0 0'
				}]
			}
        ],
        
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: ['->', {
                text: '',
                itemId: 'btnPublicarResultadoConcurso',
                iconCls: 'icon-finish-flag',
                tooltip: 'Publicar o resultado do concurso',
                handler : 'onPublicarResultadoConcursoClick',
				visible: false
            }, {
                text: '',
                itemId: 'btnEncerrarConcurso',
                iconCls: 'icon-red-light',
                tooltip: 'Encerrar concurso',
                handler : 'onEncerrarConcursoClick',
				visible: false
            }, {
                text: '',
                itemId: 'btnIniciarConcurso',
                iconCls: 'icon-green-light',
                tooltip: 'Iniciar concurso',
                handler : 'onIniciarConcursoClick',
				visible: true
            },{
				text: '',
                itemId: 'btnAdicionarConcursando',
                iconCls: 'icon-plus',
                tooltip: 'Adicionar magistrado ao concurso',
                handler : 'onAdicionarConcursandoClick',
				visible: true,
				disabled: true
			},{
                text: '',
                itemId: 'btnCancelarRecusa',
                iconCls: 'icon-trash',
                tooltip: 'Cancelar recusa',
                handler : 'onCancelarRecusaClick'
            }]
        }],
		
        listeners: {
            rerender: 'onRender'
        }
    }]
});
