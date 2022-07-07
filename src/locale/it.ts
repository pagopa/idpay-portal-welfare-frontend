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
          timeRangeSpendTo: 'Fine periodo',
        },
      },
      stepTwo: {
        title: 'Destinatari',
        form: {
          title1: "Criteri d'ammissione",
          subTitle1:
            'Aggiungi uno o più criteri dal catalogo, oppure definisci dei criteri che i destinatari dell’iniziativa dovranno autodichiarare.',
          criteria: 'Sfoglia criteri',
          addManually: 'Aggiungi manualmente',
          title2: 'Carica l’elenco degli ammessi',
          subTitle2:
            'Aggiungi i codici fiscali dei destinatari dell’iniziativa, così non dovranno effettuare alcun controllo d’ammissibilità.',
          title3: 'Destinatari esclusi',
          subTitle3:
            'Se conosci già i destinatari esclusi dall’iniziativa, aggiungi i loro codici fiscali così non potranno effettuare l’adesione. Puoi effettuare modifiche o aggiunte anche in un secondo momento.',
        },
      },
      stepThree: {
        title: 'Regole di spesa',
        form: {
          subTitle:
            'Puoi definire delle regole sulla spesa. Le regole ti permettono di definire quali transazioni riconoscere ai fini dell’iniziativa e come usufruire dell’importo erogato.',
          addNew: 'Aggiungi nuova',
        },
      },
      stepFour: {
        title1: 'Regole di rimborso',
        title2: 'Informazioni aggiuntive',
        form: {
          radioQuestion: 'Su quale parametro viene erogato il rimborso?',
          accumulatedAmount: 'Importo accumulato',
          timeParameter: 'Parametro temporale',
          selectTimeParam: 'Seleziona un parametro temporale',
          subTitle: 'Inserire qui una descrizione sulle info aggiuntive',
          idCodeBalance: 'Codice identificativo capitolo di bilancio (opzionale)',
        },
      },
      stepFive: {
        title: 'Informazioni legali',
        form: {
          subTitle:
            'Inserisci le URL dei documenti richiesti. Queste risorse dovranno essere raggiungibili pubblicamente durante tutta la durata dell’iniziativa. ',
          infoPrivacy: 'Informativa Privacy',
          termsCond: 'Termini e Condizioni',
          rules: 'Regolamento',
          helper: 'Hai bisogno di una sintesi delle regole?',
          helperLink: 'Scarica la checklist',
          tryUrl: 'Prova URL',
        },
      },
      common: {
        buttons: {
          back: 'Indietro',
          skip: 'Salva bozza',
          continue: 'Continua',
          send: 'Invia per la revisione',
          reset: 'Reset',
        },
        links: {
          findOut: 'Scopri di più',
        },
      },
    },
  },
};
