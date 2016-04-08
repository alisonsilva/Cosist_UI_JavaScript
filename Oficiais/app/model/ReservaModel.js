Ext.define('Oficiais.model.ReservaModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {name: 'circunscricao', type: 'string'},
        {name: 'descricao', type: 'string'},
        {name: 'qtd_disponivel', type: 'integer'},
        {name: 'qtd_reservas', type: 'integer'},
        {name: 'preferencia', type: 'integer'},
        {name: 'id', type: 'integer'}
    ]
});