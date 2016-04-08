/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('Oficiais.Application', {
    extend: 'Ext.app.Application',
    
    name: 'Oficiais',

    views: [
        'Oficiais.view.main.Main',
        'Oficiais.view.login.Login',
        'Oficiais.view.reserva.Reserva',
        'Oficiais.view.setor.Setor',
        'Oficiais.view.ranking.Ranking',
        'Oficiais.view.administracao.Administracao',
        'Oficiais.view.sorteio.Sorteio',
        'Oficiais.view.splash.Splash',
        'Oficiais.view.resultado.ResultadoSorteio',
        'Oficiais.view.criterio.Criterio'
    ],  
    
    models: [
        'ReservaModel',
        'OficialModel',
        'ConcursoModel',
        'SorteioModel',
        'ResultadoSorteioModel',
        'CriterioModel'
    ],
    
    stores: [
        'ReservaStore',
        'SetorStore',
        'OficialStore',
        'RankingStore',
        'SetorEscolhaStore',
        'ConcursoStore',
        'SorteioStore',
        'ResultadoSorteioStore',
        'CriterioStore'
    ],
    
    controllers: [
    ],
    
    launch: function () {
        // It's important to note that this type of application could use
        // any type of storage, i.e., Cookies, LocalStorage, etc.
        var loggedIn;
        Ext.setGlyphFontFamily('FontAwesome');
        
        // Check to see the current value of the localStorage key
        loggedIn = localStorage.getItem("TutorialLoggedIn");

        
        // This ternary operator determines the value of the TutorialLoggedIn key.
        // If TutorialLoggedIn isn't true, we display the login window,
        // otherwise, we display the main view
        var mainView = Ext.create({
            xtype: loggedIn ? 'app-main' : 'login'
        });
        

        
        if (loggedIn) {
            var reservas = Ext.create('Oficiais.view.reserva.Reserva');
            var setores = Ext.create('Oficiais.view.setor.Setor');
            var center = Ext.ComponentQuery.query('#main-center')[0];
            center.add(reservas);
            center.add(setores);
            center.doLayout();
        }
    },
    
    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    } 
});
