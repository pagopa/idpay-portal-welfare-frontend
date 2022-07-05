export default {
  session: {
    expired: {
      title: 'Sessione scaduta',
      message: 'Stai per essere rediretto alla pagina di login...',
    },
  },
  roles: {
    // TODO put product roles keys and their description here
    'incaricato-ente-creditore': 'Incaricato Ente Creditore',
    'referente-legale': 'Referente Legale',
    'referente-dei-pagamenti': 'Referente Dei Pagamenti',
  },
  sideMenu: {
    home: {
      title: 'Home',
    },
    newInitiative: {
      title: 'Nuova iniziativa',
    },
  },
  subHeader: {
    partySelectionSearch: {
      title: 'I tuoi enti',
      label: 'I tuoi enti',
    },
    backButton: 'Esci',
  },
  pages: {
    home: {
      title: 'Home',
      subtitle: 'subtitle',
    },
    newInitiative: {
      title: 'Crea una nuova iniziativa',
      subtitle:
        'Segui i passaggi e compila i campi richiesti. Una volta creata, potrai inviare l’iniziativa per la revisione e procedere poi alla pubblicazione.',
    },
  },
  components: {
    wizard: {
      stepOne: {
        title: 'Informazioni generali',
        form: {
          initiativeRecipients: 'A chi è rivolta?',
          person: 'persona fisica',
          family: 'Nucleo familiare',
          recipientsType: 'Conosci già i destinatari?',
          taxCodeList: 'Si, ho una lista di codici fiscali',
          manualSelection: "No, imposterò dei criteri d'ammissione",
          budget: 'Qual è il tuo budget?',
          reachedUsers: "Quanti utenti raggiunge l'iniziativa?",
          totalBudget: 'Budget totale',
          budgetPerPerson: 'Budget a persona',
          timeRangeJoinTitle: 'Quando è possibile aderire?',
          timeRangeJoinFrom: 'Inizio adesione',
          timeRangeJoinTo: 'Fine adesione',
          timeRangeSpendTitle: 'Quando è possibile spendere i fondi?',
          timeRangeSpendFrom: 'Inizio periodo',
          timeRangeSpendTo: 'fine periodo',
        },
      },
      stepTwo: {
        title: 'Destinatari',
      },
      stepThree: {
        title: 'Regole di spesa',
      },
      stepFour: {
        title: 'Regole di rimborso',
      },
      stepFive: {
        title: 'Informazioni legali',
      },
      common: {
        buttons: {
          back: 'Indietro',
          skip: 'Salva bozza',
          continue: 'Continua',
          send: 'Invia per la revisione',
          reset: 'Reset',
        },
      },
    },
  },
};
