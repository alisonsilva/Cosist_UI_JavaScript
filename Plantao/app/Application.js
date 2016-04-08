/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('Plantao.Application', {
    extend: 'Ext.app.Application',
    
    name: 'Plantao',

    views: [
        'Plantao.view.main.Main',
        'Plantao.view.login.Login',
        'Plantao.view.administracao.Administracao',
        'Plantao.view.sorteio.Sorteio',
		'Plantao.view.filtroalteracaoescala.FiltroAlteracaoEscala',
		'Plantao.view.rejeicaoescala.RejeicaoEscala',
		'Plantao.view.escala.NovaEscala',
		'Plantao.view.gerenciarrecusa.GerenciarRecusa',
		'Plantao.view.permutaescala.FiltroAlteracaoEscala',
		'Plantao.view.gerenciarpermuta.GerenciarPermuta',
		'Plantao.view.administracao_magistrado.Administracao',
		'Plantao.view.alertas_magistrado.Alerta',
		'Plantao.view.gerenciarrecusamagis.GerenciarRecusaMagis'
    ],  
    
    models: [
        'EscalaModel',
        'SorteioModel',
		'ModalidadeModel',
		'MagistradoModel',
		'MagistradoConcursoModel',
		'StatusModel',
		'PermutaEscalaModel',
		'MagistradoPermutaModel',
		'ConcursoModel',
		'PermutaModel'
    ],
    
    stores: [
        'StatusStore',
        'EscalaStore',
        'SorteioStore',
		'ModalidadeStore',
		'MagistradoStore',
		'MagistradoConcursoStore',
		'PermutaEscalaStore',
		'MagistradoPermutaStore',
		'ConcursoStore',
		'PermutaStore'
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
//            var reservas = Ext.create('Plantao.view.reserva.Reserva');
//            var setores = Ext.create('Plantao.view.setor.Setor');
            var center = Ext.ComponentQuery.query('#main-center')[0];
//            center.add(reservas);
//            center.add(setores);
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
