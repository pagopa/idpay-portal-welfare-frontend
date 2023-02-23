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
    admin: 'Amministratore',
    ope_base: 'Operatore',
    pagopa_admin: 'Operatore PagoPA',
  },
  sideMenu: {
    home: {
      title: 'Home',
    },
    newInitiative: {
      title: 'Nuova iniziativa',
    },
    initiativeList: {
      title: 'Tutte le iniziative',
    },
    initiativeOveview: {
      title: 'Panoramica',
    },
    initiativeUsers: {
      title: 'Utenti',
      rankingTitle: 'Utenti/Aderenti',
    },
    initiativeRefunds: {
      title: 'Rimborsi',
    },
    initiativeRanking: {
      title: 'Graduatoria',
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
    initiativeList: {
      title: 'Iniziative',
      subtitle: 'Visualizza e gestisci le iniziative di welfare del tuo ente.',
      tableColumns: {
        initiativeName: 'Nome',
        creationDate: 'Data creazione',
        updateDate: 'Ultima modifica',
        initiativeId: 'Codice identificativo',
        initiativeStatus: 'Stato',
      },
      emptyList: 'Non ci sono iniziative. ',
      createNew: "Crea un'iniziativa",
      search: "Cerca per nome dell'iniziativa",
      status: {
        draft: 'In bozza',
        inRevision: 'In revisione',
        toCheck: 'Modifiche richieste',
        approved: 'Approvata',
        published: 'In corso',
        closed: 'Terminata',
        suspended: 'Sospesa',
      },
      actions: {
        update: 'Modifica',
        delete: 'Elimina',
        details: 'Dettagli',
        suspend: 'Sospendi',
        check: 'Controlla',
      },
    },
    initiativeOverview: {
      info: {
        title: 'Informazioni',
        idCode: 'Codice identificativo',
        creationData: 'Data creazione',
        lastModify: 'Ultima modifica',
        initiativeState: 'Stato',
        otherinfo: {
          title: 'Date di riferimento',
          adhesion: 'Periodo di adesione',
          spend: 'Periodo di spesa',
          details: 'Vedi dettagli',
          start: 'Inizia il {{date}}',
          expiration: ' {{days}} giorni rimanenti',
          oneDayExpiration: ' {{days}} giorno rimanente',
          closed: 'Terminato',
        },
      },
      next: {
        title: 'What’s next?',
        stats: 'Statistiche',
        lastUpdate: 'Ultimo aggiornamento: ',
        join: 'Hanno aderito',
        budgetExhausted: 'Budget speso',
        ViewUsers: 'Vedi utenti',
        status: {
          subtitleApproved:
            'L’iniziativa è stata approvata dal team di PagoPA ed è pronta per essere pubblicata',
          approved: 'Pubblica',
          subtitleDraft: 'Continua la configurazione della tua iniziativa',
          draft: 'Modifica bozza',
          subtitleReview: 'Attendi che l’iniziativa sia revisionata dall’operatore PagoPA',
          review: 'Revisione in corso',
          subtitleModify:
            'Controlla i commenti che team di PagoPA ha lasciato durante la revisione dell’iniziativa',
          modify: 'Modifica iniziativa',
          checkInitiative: 'Controlla l’iniziativa',
          waitForPublish:
            'Hai approvato l’iniziativa, attendi la pubblicazione da parte dell’ente.',
          waitForReview: 'Attendi che l’ente corregga le modifiche segnalate nell’iniziativa.',
          reviewInitiative: 'È richiesta una revisione da parte tua.',
        },

        modalPublish: {
          title: 'Pubblica iniziativa',
          subtitle:
            'Stai per pubblicare l’iniziativa {{initiativeName}}, il servizio sarà visible in app e {{usersNumber}} utenti saranno avvisati tramite un messaggio su IO. Vuoi procedere con la pubblicazione?',
          initiativeWithGroupsSubtitle:
            'Stai per pubblicare l’iniziativa {{initiativeName}}, il servizio sarà visible in app e {{usersNumber}} utenti saranno avvisati tramite un messaggio su IO. Vuoi procedere con la pubblicazione?',
          initiativeWithoutGroupsSubtitle:
            'Stai per pubblicare l’iniziativa {{initiativeName}}. Il servizio sarà visible in app. Vuoi procedere con la pubblicazione?',
        },
      },
      modal: {
        title: 'Vuoi davvero eliminare?',
        subtitle: 'Se elimini, tutti i dati inseriti andranno persi.',
        delete: 'Elimina',
        cancel: 'Annulla',
      },
      snackBar: {
        approved: 'L’iniziativa verrà comunicata a',
        recipients: 'destinatari',
        users: 'Vedi utenti',
        pending:
          'Stiamo elaborando l’elenco dei destinatari. Al termine potrai pubblicare l’iniziativa.',
        uploadFailed:
          'Non siamo riusciti a completare il caricamento dei destinatari. I nostri tecnici sono già al lavoro per risolvere il problema.',
      },
    },
    initiativeDetail: {
      subtitle: 'Visualizza l’iniziativa di welfare da erogare ai cittadini.',
      alertText: 'Controlla le informazioni inserite dall’ente e approva o rifiuta la richiesta.',
      accordion: {
        step1: {
          heading: 'Step 1',
          title: 'Configurazione del servizio',
          description: 'placeholder text',
          content: {
            description: 'Descrizione',
            serviceDeliver: 'Erogazione del servizio',
            serviceOnIO: 'App IO',
            serviceNotOnIO: 'Non erogata su App IO',
            serviceName: 'Nome del servizio',
            serviceArea: 'Area di competenza',
            serviceAreaNational: 'Nazionale',
            serviceAreaLocal: 'Locale',
            serviceDescription: 'Cosa permette di fare questo servizio?',
            legalInfo: 'Informazioni legali',
            privacyPolicyURL: 'URL Privacy Policy',
            tosURL: 'Regolamento (Termini e Condizioni)',
            assistanceChannels: 'Canali di assistenza',
            webUrl: 'Web URL',
            mobile: 'Numero di telefono',
            email: 'Email',
          },
        },
        step2: {
          heading: 'Step 2',
          title: 'Informazioni generali',
          description: 'placeholder text',
          content: {
            beneficiaryType: "A chi è rivolta l'iniziativa?",
            person: 'Persona fisica',
            family: 'Nucleo familiare',
            beneficiaryknown: 'Conosci già i destinatari?',
            taxCodeList: 'Si, ho una lista di codici fiscali',
            manualSelection: "No, imposterò dei criteri d'ammissione",
            rankingEnabledQuestion: 'È presente una graduatoria?',
            rankingEnabledAnswerYes: 'Sì',
            rankingEnabledAnswerNo: 'No',
            budget: 'Budget totale',
            beneficiaryBudget: 'Budget a persona',
            rankingStartDate: 'Inizio adesione',
            rankingEndDate: 'Fine adesione',
            startDate: 'Inizio periodo',
            endDate: 'Fine periodo',
          },
        },
        step3: {
          heading: 'Step 3',
          title: 'Destinatari',
          description: 'placeholder text',
          content: {
            admissionCriteria: "Criteri d'ammissione",
            exact: 'Esattamente',
            majorTo: 'maggiore di',
            minorTo: 'minore di',
            majorOrEqualTo: 'maggiore uguale di',
            minorOrEqualTo: 'minore uguale di',
            is: 'è',
            isNot: 'Non è',
            between: 'Compreso tra',
            and: 'e',
            birthdate: 'Data di nascita',
            year: 'Anno',
            age: 'Età',
            residency: 'Residenza',
            postalCode: 'Cap',
            city: 'Città',
            region: 'Regione',
            nation: 'Nazione',
            cityCouncil: 'Comune',
            province: 'Provincia',
            isee: 'ISEE',
            manual: 'Criterio # ',
            boolean: 'Booleano',
            multi: 'Scelta multipla',
            beneficiaryList: 'Elenco degli ammessi',
            beneficiaryNumber: 'Numero beneficiari ammessi',
            fileUploadedStatus: 'Esito file caricato',
            fileProcessingStatus: 'Esito elaborazione',
            statusOk: 'Corretto',
            statusKo: 'Fallito',
            statusLoading: 'In corso',
            fileUploadedErrorMessage:
              'L’anonimizzazione del file non è andata a buon fine. Segnala all’ente di dover ricaricare il file corretto per poter procedere con l’approvazione dell’iniziativa.',
            rankingAsc: ' - In graduatoria vince il valore minore',
            rankingDesc: ' - In graduatoria vince il valore maggiore',
            apiClientTitle: 'API Key di connessione',
            apiKeyClientId: 'Client ID',
            apiKeyClientAssertion: 'Client Assertion',
          },
        },
        step4: {
          heading: 'Step 4',
          title: 'Regole di spesa',
          description: 'placeholder text',
          content: {
            percentageRecognized: 'Percentuale riconosciuta',
            rewardRuleFixed: 'Fissa',
            spentLimit: 'Limite di spesa',
            threshold: 'Minimo {{minValue}} € - Massimo {{maxValue}} €',
            transactionNumber: 'Numero transazioni',
            transactionNumberInterval: 'Minimo {{minValue}} - Massimo {{maxValue}}',
            mcc: 'Merchant Category Code',
            everybodyExceptItem: 'Tutti tranne',
            nobodyExceptItem: 'Nessuno tranne',
            timeLimit: 'Limite temporale',
            daily: 'Al giorno',
            monthly: 'Al mese',
            yearly: "All'anno",
            transactionTime: 'Orario della transazione',
            monday: 'Lunedì',
            tuesday: 'Martedì',
            wednesday: 'Mercoledì',
            thursday: 'Giovedì',
            friday: 'Venerdì',
            saturday: 'Sabato',
            sunday: 'Domenica',
            timeInterval: 'dalle {{minTime}} alle {{maxTime}}',
          },
        },
        step5: {
          heading: 'Step 5',
          title: 'Regole di rimborso',
          description: 'placeholder text',
          content: {
            disbursement: 'Erogazione del rimborso',
            accumulatedAmount: 'Importo accumulato',
            timeParameter: 'Parametro temporale',
            timeParam: 'Parametro',
            refundThreshold: 'Soglia per il rimborso',
            addtitionalInfo: 'Informazioni aggiuntive',
            idCode: `Codice identificativo capitolo di bilancio`,
            initiativeDone: 'A iniziativa conclusa',
            everyDay: 'Ogni giorno',
            everyWeek: 'Ogni settimana',
            everyMonth: 'Ogni mese',
            everyThreeMonths: 'Ogni tre mesi',
            balanceExhausted: 'A saldo esaurito',
            certainThreshold: 'Al  raggiungimento di una determinata soglia',
          },
        },
        buttons: {
          back: 'Indietro',
          reject: 'Rifiuta',
          approve: 'Approva',
          edit: 'Modifica',
          delete: 'Elimina',
        },
        modal: {
          title: 'Vuoi procedere?',
          subtitle: 'Avverti l’ente via email di eventuali segnalazioni o note.',
        },
      },
      alert: {
        approved: 'Operazione completata.',
      },
    },
    assistance: {
      title: 'Assistenza',
      subtitle:
        'Come possiamo aiutarti? Compila e invia il modulo: ti ricontatteremo al più presto.',
      form: {
        subject: 'Oggetto del messaggio',
        message: 'Descrivi il motivo della tua richiesta',
        sendBtn: 'Iniva',
      },
      exitModal: {
        body: 'Se esci, la richiesta di assistenza andrà persa.',
      },
    },
    thankyouPage: {
      title: 'Abbiamo ricevuto la tua <1/> richiesta',
      description: 'Ti risponderemo al più presto al tuo indirizzo e-mail.',
      buttonLabel: 'Chiudi',
    },
    initiativeRanking: {
      title: 'Graduatoria',
      subtitle:
        'Visualizza la lista degli aderenti suddivisa per idoneità e organizzata per criteri',
      publishedSubtitle: 'Approvata e pubblicata il {{date}} alle {{hour}}',
      noData: 'La graduatoria non è stata ancora elaborata.',
      rankingStatus: {
        notReady: 'La graduatoria sarà elaborata al termine del periodo di adesione.',
        readyToBePublishedTitle: 'La graduatoria è pronta per essere pubblicata',
        readyToBePublishedSubtitle:
          "Dopo la pubblicazione gli aderenti assegnatari e idonei non assegnatari riceveranno notifica in appIO e un SMS con l' esito",
        publishingTitle: 'La graduatoria è in fase di pubblicazione',
        publishBtn: 'Pubblica',
        published:
          'È stata inviata una notifica agli assegnatari su appIO con la conferma dell’esito',
        publishedCloseBtn: 'Ho capito',
      },
      publishModal: {
        title: 'Pubblica la graduatoria',
        subtitle:
          'Se pubblichi la graduatoria, l’iniziativa avrà inizio e gli utenti che sono aderenti assegnatari e idonei non assegnatari riceveranno una notifica in appIO e un SMS con l’esito. L’operazione è irreversibile',
        cancelBtn: 'Annulla',
        publishBtn: 'Pubblica',
        alertTitle: 'Ricorda di scaricare il csv della graduatoria',
        alertBtn: 'Scarica file',
      },
      form: {
        search: 'Cerca per Codice fiscale',
        beneficiaryStatus: 'Stato',
        filterBtn: 'Filtra',
        resetFiltersBtn: 'Annulla filtri',
      },
      table: {
        beneficiary: 'Aderenti',
        ranking: 'Posizione',
        rankingValue: 'ISEE',
        criteriaConsensusTimeStamp: 'Data e ora',
      },
      beneficiaryStatus: {
        total: 'Totale aderenti ({{tot}})',
        eligibleOk: 'Assegnatari ({{tot}})',
        eligibleKo: 'Idonei non assegnatari ({{tot}})',
        onboardingKo: 'Non idonei ({{tot}})',
      },
    },
    initiativeUsers: {
      title: 'Utenti',
      titleRanking: 'Utenti/Aderenti',
      subtitle: 'Visualizza e gestisci gli utenti aderenti all’iniziativa',
      noData: 'Non sono presenti utenti.',
      form: {
        search: 'Cerca per Codice fiscale',
        from: 'Da',
        to: 'A',
        status: 'Stato',
        all: 'Tutti gli stati',
        waiting: 'In attesa',
        registered: 'Iscritto',
        suitable: 'Idoneo',
        notSuitable: 'Non idoneo',
        filterBtn: 'Filtra',
        resetFiltersBtn: 'Annulla filtri',
      },
      table: {
        beneficiary: 'Beneficiario',
        updateStatusDate: 'Data e ora',
        beneficiaryState: 'Stato',
      },
      status: {
        acceptedTc: 'In corso',
        inactive: 'Disiscritto',
        onEvaluation: 'In attesa',
        invited: 'Idoneo',
        onboardingOk: 'Iscritto',
        onboardingKo: 'Non idoneo',
        notSignedOn: 'Non iscritto',
        assignee: 'Assegnatario',
        eligible: 'Idoneo',
      },
    },
    initiativeUserDetails: {
      downloadCsvBtn: 'Scarica .csv',
      initiativeState: 'Stato iniziativa',
      historyState: 'Storico eventi',
      updatedOn: 'Aggiornato il',
      addedBy: 'Aggiunto dal canale',
      availableBalance: 'Importo disponibile',
      refundedBalance: 'Importo rimborsato',
      balanceToBeRefunded: 'Importo da rimborsare',
      summary: 'Riepilogo',
      refundDetail: 'Dati per il rimborso',
      alerts: 'avvisi',
      paymentMethod: 'Metodi di pagamento abilitati',
      iban: 'IBAN associato',
      missingPaymentMethod: 'Nessun metodo di pagamento',
      missingIban: 'Nessun IBAN presente',
      unsubscribed: 'Utente disiscritto',
      eligibleKo: 'Idoneo non assegnataro',
      eligibleKoDescription:
        'L’utente possiede i requisiti per l’adesione ma non rientra in graduatoria per termine posti.',
      onboardingKo: 'Non idoneo',
      onboardingKoDescription: 'L’utente non possiede i requisiti per l’adesione.',
      downloadCsv:
        'La richiesta di download è stata presa in carico. Non appena il file sarà generato, ti sarà inviato via email.',
      appIo: 'App IO',
      issuer: 'Issuer',
      noData: 'Non sono presenti eventi.',
      table: {
        dateAndHour: 'Data e ora',
        event: 'Evento',
        totExpense: 'Totale spesa',
        toRefund: 'Da rimborsare',
      },
      operationTypes: {
        onboarding: 'Adesione iniziativa',
        addIban: 'Aggiunta IBAN',
        addInstrument: 'Aggiunta metodo',
        deleteInstrument: 'Eliminazione metodo',
        rejectedAddInstrument: 'Errore aggiunta metodo',
        rejectedDeleteInstrument: 'Errore eliminazione metodo',
        rejectedRefund: 'Errore rimborso',
        transaction: 'Pagamento Pos',
        paidRefund: 'Rimborso',
        reversal: 'Storno',
      },
      filterEvent: 'Filtra per evento',
      transactionDetail: {
        import: 'Importo',
        paymentMethod: 'Metodo di pagamento',
        brand: 'Brand',
        totExpense: 'Totale spesa',
        importToRefund: 'Importo da rimborsare',
        date: 'Data',
        acquirerTransactionId: 'ID transazione Acquirer',
        issuerTransactionId: 'ID transazione Issuer',
        result: 'Esito',
        bank: 'Banca',
        iban: 'IBAN',
        positiveResult: 'Eseguito',
        negativeResult: 'Fallito',
      },
    },
    initiativeRefunds: {
      title: 'Rimborsi',
      subtitle: 'Visualizza e gestisci i rimborsi dell’iniziativa',
      noData: 'Non sono presenti rimborsi.',
      uploadBtn: 'Carica esiti',
      form: {
        from: 'Da',
        to: 'A',
        status: 'Stato',
        completed: 'Completato',
        toLoad: 'Esiti da caricare',
        partial: 'Esiti parziali',
        filterBtn: 'Filtra',
        resetFiltersBtn: 'Annulla filtri',
      },
      table: {
        creationDate: 'Data di creazione',
        typology: 'Tipologia',
        amount: 'Importo',
        refunds: 'Rimborsi',
        successPercentage: '% Successo',
        status: 'Stato',
        typeOrdinary: 'Ordinario',
      },
      status: {
        exported: 'Esiti da caricare',
        partial: 'Esiti parziali ({{percentage}}%)',
        complete: 'Completato',
      },
      uploadFile: {
        feedbackOk: 'File caricato correttamente',
        feedbackKo: 'Errore nel caricamento del file',
      },
    },
    initiativeRefundsOutcome: {
      title: 'Gestione esiti',
      uploadPaper: {
        title: 'Carica un nuovo file',
        subtitle:
          'Una volta caricato, il file verrà elaborato così da aggiornare lo stato dei rimborsi.',
        findOut: 'Scopri di più',
        dragAreaText: 'Trascina qui il file .zip contenente la lista degli esiti o ',
        dragAreaLink: 'selezionalo dal tuo computer.',
        fileUploadHelpText: 'Non sai come preparare il file?',
        fileUuploadHelpFileLinkLabel: 'Scarica il file .zip di esempio',
        fileIsLoading: 'Caricamento in corso...',
        fileIsOnEvaluation:
          'Stiamo elaborando il file caricato. Riceverai un’email al termine dell’operazione.',
        validFile: 'File valido',
        changeFile: 'Sostituisci file',
        invalidFileTitle: 'Il file caricato non è valido',
        invalidFileDescription: 'Errore',
        invalidFileTypeDescription: 'Sono ammessi solamente file .zip',
        overMaxUploadDescription: 'La dimensione massima supportata è di 175MB',
        upoloadsHistoryTitle: 'Storico caricamenti',
        rewardsResulted: '{{x}} esiti trovati',
        rewardsAdded: '{{x}} esiti aggiunti',
      },
    },
    initiativeRefundsDetails: {
      downloadBtn: 'Scarica File',
      recap: {
        creationDate: 'Data creazione',
        totalOrders: 'Totale ordine',
        totalRefunds: 'Totale rimborsato',
        totalWarrant: 'Totale mandati',
        percentageSuccess: '% Successo',
        status: 'Stato',
      },
      form: {
        cro: 'Inserisci CRO',
        outcome: 'Esito',
        filterBtn: 'Filtra',
        resetFiltersBtn: 'Annulla filtri',
      },
      table: {
        iban: 'IBAN',
        amount: 'Importo',
        outcome: 'Esito',
      },
      status: {
        failed: 'Fallito',
        done: 'Eseguito',
        onEvaluation: 'In attesa',
      },
      modal: {
        title: 'Rimborso',
        taxIdCode: 'Codice Fiscale',
        iban: 'IBAN',
        amount: 'Importo',
        referencePeriod: 'Periodo di riferimento',
        outcome: 'Esito',
        typology: 'Tipologia',
        cro: 'CRO',
        transferDate: 'Data di invio bonifico',
        userNotificationDate: 'Data notifica all’utente',
        ordinary: 'Ordinario',
        remedial: 'Correttivo',
      },
    },
    chooseOrganization: {
      title: 'Seleziona Ente',
      subtitle: 'L’elenco mostra soltanto i Comuni che hanno iniziative da revisionare o in corso.',
      searchInputLabel: 'Cerca ente',
      continueBtnLabel: 'Continua',
    },
  },
  breadcrumbs: {
    exit: 'Esci',
    back: 'Indietro',
    initiatives: 'Iniziative',
    createNew: 'Crea nuova iniziativa',
    initiativeDetail: 'Dettagli iniziativa',
    initiativeRanking: 'Graduatoria',
    initiativeUsers: 'Utenti',
    initiativeUsersRanking: 'Utenti/Aderenti',
    initiativeRefunds: 'Rimborsi',
    initiativeRefundsOutcome: 'Gestione esiti',
    initiativeRefundsDetails: 'Dettaglio rimborso',
    initiativeUserDetails: 'Dettaglio nucleo familiare',
  },
  components: {
    wizard: {
      stepOne: {
        title: 'Configurazione del servizio',
        subtitle:
          'L’iniziativa può essere fruita dall’app IO, dalle app degli Issuer convenzionati e presso la Rete Anti Digital-Divide. Per erogare l’iniziativa su IO è necessario associarla ad un servizio che verrà esposto in app. Il servizio si occuperà anche di mandare i relativi messaggi per informare i destinatari durante il ciclo di vita dell’iniziativa.',
        form: {
          initiativeOnIo: 'Eroga l’iniziativa su IO',
          description: 'Descrizione',
          serviceName: 'Nome del servizio',
          serviceArea: 'Area di competenza',
          serviceDescription: 'Cosa permette di fare questo servizio?',
          legalInfo: 'Informazioni legali',
          privacyPolicyUrl: 'URL Privacy policy',
          tryUrl: 'Prova URL',
          termsAndConditions: 'Regolamento (Termini e Condizioni)',
          assistanceChannels: 'Canali di assistenza',
          indicateChannel: 'Indica il canale',
          channelType: 'Tipo di canale',
          webUrl: 'Web URL',
          email: 'Email',
          phone: 'Telefono',
          addChannel: 'Aggiungi un altro canale',
          serviceScopeLocal: 'Locale',
          serviceScopeNational: 'Nazionale',
        },
        modal: {
          serviceNotOnIOTitle: 'Servizio non erogato su IO',
          serviceNotOnIODescription:
            'Stai per creare un servizio che non include la creazione e l’erogazione sull’app IO, ma soltato su un app terza. Sei sicuro di voler continuare?',
          cancelBtn: 'Annulla',
          continueBtn: 'Continua',
        },
        uploadIcon: {
          dragAreaText: 'Trascina qui il logo del servizio o',
          dragAreaLink: 'selezionalo dal tuo computer.',
          helperText:
            'Opzionale. Inserisci un’immagine in formato PNG, 300x300 pixel, con sfondo bianco o trasparente.',
          IconIsLoading: 'Caricamento in corso...',
          validIcon: 'File valido',
          changeIcon: 'Sostituisci Logo',
          overMaxUploadLogoDescription: 'La dimensione massima supportata è di 1MB',
          invalidFileTypeLogoDescription: 'Sono ammessi solamente file png',
          invalidFileTitle: 'Il file caricato non è valido',
          invalidFileDescription: 'Errore',
        },
      },
      stepTwo: {
        title: 'Informazioni generali',
        form: {
          beneficiaryType: 'A chi è rivolta?',
          person: 'Persona fisica',
          family: 'Nucleo familiare',
          beneficiaryKnown: 'Conosci già i destinatari?',
          taxCodeList: 'Si, ho una lista di codici fiscali',
          manualSelection: "No, imposterò dei criteri d'ammissione",
          withRanking: 'È prevista una graduatoria?',
          yes: 'Sì',
          no: 'No',
          budgetTitle: 'Qual è il tuo budget?',
          reachedUsers: 'Utenti raggiungibili',
          reachedUsersTooltip:
            'Numero di utenti raggiungibili dall’iniziativa dividendo il budget totale per il budget a persona.',
          budget: 'Budget totale',
          beneficiaryBudget: 'Budget a persona',
          timeRangeRankingTitle: 'Quando è possibile aderire?',
          rankingStartDate: 'Inizio adesione',
          rankingEndDate: 'Fine adesione',
          timeRangeTitle: 'Quando è possibile spendere i fondi?',
          startDate: 'Inizio periodo',
          endDate: 'Fine periodo',
          preview: 'Vedi anteprima',
          introductionTitle: 'Testo introduttivo',
          introductionSubTitle:
            'Serve a introdurre l’inziativa all’utente che aderisce tramite l’app IO, illustrando in maniera sintetica le regole.',
          introductiveInfoLabel: "Descrivi le regole dell'iniziativa",
          requiredItalianIntroduction: 'Campo italiano obbligatorio',
        },
        previewModal: {
          title: 'Anteprima',
          closeBtn: 'Chiudi',
          checkGuide: ` consulta la guida.`,
          alertDescription:
            'Qui puoi vedere come gli utenti visualizzeranno il contenuto su IO. Per maggiori informazioni,',
        },
      },
      stepThree: {
        title: 'Destinatari',
        chooseCriteria: {
          title: "Criteri d'ammissione",
          subtitle:
            'Aggiungi uno o più criteri dal catalogo, oppure definisci dei criteri che i destinatari dell’iniziativa dovranno autodichiarare.',
          browse: 'Sfoglia criteri',
          addManually: 'Aggiungi manualmente',
          iseeNotPopulatedOnRankingErrorTitle: 'È presente una graduatoria',
          iseeNotPopulatedOnRankingErrorDescription: 'Il criterio ISEE è obbligatorio',
          modal: {
            subtitle:
              'In questa lista trovi i criteri che possono essere verificati in automatico tramite gli Enti che detengono le informazioni.',
            addButton: 'Aggiungi',
            searchCriteria: 'Cerca criteri',
          },
          admissionCriteriaAdded: 'Criteri aggiunti',
          manualCriteriaAdded: 'Criteri manuali',
          apiKeyConnection: {
            title: 'API Key di connessione',
            subtitle:
              'Aggiungi le due chiavi per abilitare la connessione con gli Enti che forniranno le informazioni necessarie alla verifica dei criteri.',
            form: {
              clientId: 'Client ID',
              clientAssertion: 'Client Assertion',
            },
          },
          form: {
            year: 'Anno',
            age: 'Età',
            exact: 'Esattamente',
            majorTo: 'Maggiore di',
            minorTo: 'Minore di',
            majorOrEqualTo: 'Maggiore uguale di',
            minorOrEqualTo: 'Minore uguale di',
            between: 'Compreso tra',
            value: 'Valore',
            name: 'Nome',
            postalCode: 'Cap',
            city: 'Città',
            region: 'Regione',
            nation: 'Nazione',
            cityCouncil: 'Comune',
            province: 'Provincia',
            is: 'È',
            isNot: 'Non è',
            manual: 'Criterio # ',
            boolean: 'Booleano',
            multi: 'Scelta multipla',
            addOption: 'Aggiungi opzione',
            rankingOrderASC: 'Vince il valore minore',
            rankingOrderDESC: 'Vince il valore maggiore',
          },
        },
        upload: {
          title: 'Carica l’elenco degli ammessi',
          subTitle:
            'Aggiungi i codici fiscali dei destinatari dell’iniziativa, così non dovranno effettuare alcun controllo d’ammissibilità.',
          title3: 'Destinatari esclusi',
          subTitle3:
            'Se conosci già i destinatari esclusi dall’iniziativa, aggiungi i loro codici fiscali così non potranno effettuare l’adesione. Puoi effettuare modifiche o aggiunte anche in un secondo momento.',
          dragAreaText: 'Trascina qui il file .csv con la lista dei codici fiscali o',
          dragAreaLink: 'selezionalo dal tuo computer.',
          fileIsLoading: 'Caricamento in corso...',
          invalidBeneficiaryNumberTitle: 'Il file caricato contiene troppi codici fiscali',
          invalidBeneficiaryNumberDescription: 'Aumenta il budget o rimuovi i destinatari',
          invalidFileTitle: 'Il file caricato non è valido',
          invalidFileDescription: 'Errore',
          invalidFileTypeDescription: 'Sono ammessi solamente file csv',
          notEmptyDescription: 'Il file non può essere vuoto',
          overMaxUploadDescription: 'La dimensione massima supportata è di 2MB',
          invalidRow: 'Errore: riga {{rowNumber}}',
          retry: 'Carica di nuovo',
          changeFile: 'Sostituisci file',
          validFile: 'File valido',
          fileUploadHelpText: 'Non sai come preparare la lista?',
          fileUuploadHelpFileLinkLabel: 'Scarica il file di esempio',
        },
      },
      stepFour: {
        title: 'Regole di spesa',
        subtitle:
          'Puoi definire delle regole sulla spesa. Le regole ti permettono di definire quali transazioni riconoscere ai fini dell’iniziativa e come usufruire dell’importo erogato.',
        addNew: 'Aggiungi nuova',
        rulesAddedTitle: 'regole aggiunte',
        modal: {
          title: 'Aggiungi regola',
          subtitle:
            'Le regole ti permettono di definire quali transazioni riconoscere ai fini dell’iniziativa e come usufruire dell’importo erogato.',
        },
        mccModal: {
          title: 'Elenco categorie merceologiche',
          subtitle:
            'In questa lista trovi i Merchant Category Code (MCC) utilizzati dai circuiti di pagamento per riconoscere la tipologia di beni o servizi forniti.',
          searchCodeOrDescription: 'Cerca per codice o descrizione',
          addButton: 'Aggiorna',
          selectAllButtonName: 'Seleziona tutti',
          deselectAllButtonName: 'Deseleziona tutti',
        },
        form: {
          percentageRecognized: 'Percentuale riconosciuta',
          minSpeningLimit: 'Minimo',
          maxSpeningLimit: 'Massimo',
          minTransactionNumber: 'Minimo',
          maxTransactionNumber: 'Massimo',
          minSpendingLimitTooltip:
            'Le transazioni di importo inferiore a questo valore verranno scartate.',
          maxSpendingLimitTooltip:
            'La percentuale di spesa viene calcolata su questo valore per le transazioni di importo superiore.',
          minTransactionNumberTooltip:
            'Il numero minimo di transazioni necessario per poter erogare il rimborso',
          maxTransactionNumberTooltip:
            'Il numero massimo di transazioni consentite per spendere l’importo erogato',
          monday: 'Lunedì',
          tuesday: 'Martedì',
          wednesday: 'Mercoledì',
          thursday: 'Giovedì',
          friday: 'Venerdì',
          saturday: 'Sabato',
          sunday: 'Domenica',
          minTime: 'Dalle ore',
          maxTime: 'Alle ore',
          timeFormatTooltip: 'Inserisci nel formato hh:mm (es.: 08:16)',
          addTransactionTimeItem: 'Aggiungi orario',
          rewardLimitDaily: 'Al giorno',
          rewardLimitMonthly: 'Al mese',
          rewardLimitYearly: "All'anno",
          addTimeLimitItem: 'Aggiungi limite',
          maxReward: 'Importo massimo',
          selectFromList: "Seleziona dall'elenco",
          mccCodes: 'Inserisci o incolla i codici separati da virgola',
          everybodyExceptSelectItem: 'Tutti tranne',
          nobodyExceptSelectItem: 'Nessuno tranne',
        },
      },
      stepFive: {
        title1: 'Regole di rimborso',
        title2: 'Informazioni aggiuntive',
        form: {
          radioQuestion: 'Su quale parametro viene erogato il rimborso?',
          accumulatedAmount: 'Importo accumulato',
          timeParameter: 'Parametro temporale',
          selectTimeParam: 'Seleziona un parametro temporale',
          selectedAccumulatedAmount: 'Seleziona un importo accumulato',
          subTitle: 'Inserire qui una descrizione sulle info aggiuntive',
          idCodeBalance: 'Codice identificativo capitolo di bilancio (opzionale)',
          reimbursementThreshold: 'Indica la soglia per il rimborso',
        },
        select: {
          accumulatedAmount: {
            balanceExhausted: 'A saldo esaurito',
            certainThreshold: 'Al  raggiungimento di una determinata soglia',
          },
          timrParameter: {
            initiativeDone: 'A iniziativa conclusa',
            everyDay: 'Ogni giorno',
            everyWeek: 'Ogni settimana',
            everyMonth: 'Ogni mese',
            everyThreeMonths: 'Ogni tre mesi',
          },
        },
        sendInitiativeInRevisionMsg: 'Iniziativa inviata in revisione',
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
        languages: {
          italian: 'Italiano',
          english: 'Inglese',
          french: 'Francese',
          german: 'Tedesco',
          slovenian: 'Sloveno',
        },
        draftSaved: 'Bozza salvata correttamente',
      },
    },
    exitModal: {
      title: 'Vuoi davvero uscire?',
      body: 'Se esci, le modifiche andranno perse.',
      exitBtn: 'Esci',
      cancelBtn: 'Annulla',
    },
  },
  validation: {
    required: 'Campo obbligatorio',
    numeric: 'Il campo deve contenere un valore numerico',
    integer: 'Il campo deve contenere un valore intero',
    positive: 'Il campo deve contenere un valore positivo',
    minOne: 'Il campo deve contenere un valore maggiore o uguale a 1',
    outBudgetPerPerson: 'Il budget a persona deve essere minore del budget totale',
    outJoinFrom: 'La data di inizio adesione non può essere antecedente ad oggi',
    outJoinTo: 'La data di fine adesione deve essere successiva a quella di inizio',
    outSpendFrom:
      'La data di inizio periodo spesa deve essere successiva alla data di fine adesione',
    outSpendFromWithRanking:
      'Deve intercorrere un intervallo di almeno 10 giorni tra la data di fine adesione e quella di inizio spendibilità',
    outSpendTo: 'La data di fine periodo spesa deve essere successiva a quella di inizio',
    outValue: 'Il secondo valore deve essere maggiore del primo',
    maxTwoHundred: 'Max 200 caratteri',
    maxFiveHundred: 'Max 500 caratteri',
    maxDescriptionChar: 'La descrizione del servizio può contenere massimo 350 caratteri',
    maxServiceNameChar: 'Il nome del servizio può contenere massimo 50 caratteri',
    maxArgumentsChar: 'L’argomento può contenere massimo 100 caratteri',
    web: 'Inserire un indirizzo web valido',
    email: 'Inserire un indirizzo email valido',
    celNum: 'Inserire un numero di telefono valido',
    webValid: 'Il canale deve essere un indirizzo web',
    emailValid: 'Il canale deve essere un indirizzo email',
    celNumValid: 'il canale deve essere un numero di telefono',
    invalidDate: 'Data non valida',
    outMaxSpendingLimit: 'Il valore di spesa massimo deve essere maggiore del minimo',
    outTransactionNumberLimit: 'Il numero massimo di transazioni deve essere maggiore del minimo',
    outPercentageRecognized: 'La percentuale massima non può essere maggiore di 100',
    formatTimeInvalid: 'Ora non valida',
    outTransactionTime: "L'orario di fine deve essere maggiore di quello d'inizio",
    uniqueFrequency: 'Non è possible inserire due importi differenti per lo stesso limite',
    uniqueInterval: 'Non è possibile inserire due intervalli uguali per lo stesso giorno',
    notValidMccLis: 'Sono stati inseriti valori non validi',
    maxValue: 'Il valore deve essere inferiore o uguale a {{value}}',
    indicateAssistanceSubject: 'Indicaci l’argomento della tua richiesta',
    outDateTo: 'La data di fine deve essere successiva a quella di inizio',
  },
  errors: {
    title: 'Si è verificato un errore',
    invalidDataDescription: 'Controllare i dati inseriti',
    getDataDescription: 'Riprovare',
    getFileDataDescription: 'Caricare nuovamente il file',
    cantRejectInitiative: "Non è stato possibile rifiutare l'iniziativa. Riprova",
    cantApproveInitiative: 'Non è stato possibile inviare la  revisione. Riprova.',
    cantPublishInitiative: "Non è stato possibile pubblicare l'iniziativa. Riprova",
    cantDeleteInitiative: "Non è stato possibile eliminare l'iniziativa. Riprova",
    contactAdmin: "Contattare l'assistenza",
    cantSaveTC: "Non è stato possibile salvare l'accettazione dei termini e condizioni",
    cantGetTC:
      "Non è stato possibile recuperare le informazioni in merito all'accettazione dei termini e condizioni",
  },
  helpStaticUrls: {
    wizard: {
      serviceConfig: 'https://www.google.it',
      generalInfo: 'https://www.google.it',
      admissionCriteria: 'https://www.google.it',
      fileUpload: 'https://www.google.it',
      shopRules: 'https://www.google.it',
      shopRulesModal: 'https://www.google.it',
    },
    pages: {
      initiativeRefundsOutcome: 'https://www.google.it',
    },
  },
  tos: {
    title: 'Portale Bonus',
    termsDescription: 'Accedendo, accetti i',
    linkTos: 'Termini e condizioni d’uso',
    termsDescription2: 'del servizio e confermi di aver letto l’',
    linkPrivacy: 'Informativa Privacy',
    backHome: 'Torna alla home',
    termsDescriptionChanged: 'Recentemente abbiamo cambiato i',
    and: 'e l’',
  },
};
