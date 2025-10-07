export const missionCatalog:  Record<string, {
  label: string
  prestations: Record<string, {
    label: string
    description: string
  }>
}> = {
  A: {
    label: 'Droit des Affaires & Corporate',
    prestations: {
      A1: {
        label: 'Création & Immatriculation d\'Entreprise',
        description: `Conseil sur le type de société (SARL, SA, Succursale, etc.)
Rédaction des statuts adaptés au droit guinéen (Acte Uniforme OHADA)
Accomplissement des formalités auprès du Centre de Formalités des Entreprises (CFE) et du Tribunal de Commerce
Immatriculation au Registre du Commerce et du Crédit Mobilier (RCCM)`
      },
      A2: {
        label: 'Conseil Corporate & Gouvernance',
        description: `Rédaction des procès-verbaux (Assemblées Générales, Conseils d'Administration)
Conseil en gouvernance d'entreprise et respect des obligations légales
Gestion des modifications statutaires (augmentation de capital, changement de dirigeant)
Mise en conformité avec le droit des sociétés commerciales (OHADA)`
      },
      A3: {
        label: 'Contrats & Vie des Affaires',
        description: `Rédaction et négociation de contrats commerciaux (vente, distribution, partenariat)
Rédaction de contrats de travail et conseils en droit social guinéen
Conseils en droit de la concurrence et de la consommation
Contrats de confidentialité (NDA) et de propriété intellectuelle`
      },
      A4: {
        label: 'Due Diligence Juridique',
        description: `Audit juridique complet dans le cadre d'opérations de fusion-acquisition
Examen des contrats, conventions et engagements en cours
Vérification de la conformité légale et réglementaire
Analyse des litiges en cours et potentiels
Évaluation des droits de propriété intellectuelle et industrielle
Examen des aspects sociaux et du droit du travail
Rapport de due diligence avec identification des risques juridiques`
      },
      A5: {
        label: 'Fusions-Acquisitions & Restructurations',
        description: `Structuration d'opérations (fusion, scission, apport d'actifs)
Négociation des garanties de passif et des clauses contractuelles
Conseils sur les procédures de licenciement collectif (si applicable)
Accompagnement dans les opérations de LBO et de transmission`
      },
      A6: {
        label: 'Formation en Droit des Affaires',
        description: `Formation sur le droit des sociétés OHADA et ses évolutions
Formation sur la rédaction et la négociation des contrats commerciaux
Sensibilisation aux obligations légales des dirigeants et administrateurs
Ateliers pratiques sur la gouvernance d'entreprise
Formation adaptée aux besoins spécifiques de l'entreprise`
      },
    },
  },
  B: {
    label: 'Droit Fiscal & Conformité',
    prestations: {
      B1: {
        label: 'Conseil et Optimisation Fiscale',
        description: `Analyse et choix du régime fiscal optimal (BIC, BNC)
Conseils en matière d'Impôt sur les Sociétés (IS), de TVA et de droits d'accises
Optimisation de la fiscalité des groupes et des dirigeants
Conseils sur les incitations fiscales (Code Minier, Code des Investissements)`
      },
      B2: {
        label: 'Due Diligence Fiscale',
        description: `Audit fiscal approfondi dans le cadre d'opérations de fusion-acquisition
Examen de la conformité des déclarations fiscales passées
Identification des risques fiscaux latents et des contentieux potentiels
Analyse des positions fiscales et des options retenues
Vérification du calcul des impôts différés actifs et passifs
Évaluation des opportunités d'optimisation fiscale
Rapport de due diligence fiscale avec cartographie des risques`
      },
      B3: {
        label: 'Revue Fiscale',
        description: `Examen complet de la situation fiscale de l'entreprise
Vérification de la conformité des pratiques fiscales
Identification des risques de redressement
Analyse de l'optimisation fiscale et des économies d'impôts possibles
Recommandations pour sécuriser la position fiscale
Revue des provisions pour impôts et des impôts différés
Élaboration d'un plan d'action correctif si nécessaire`
      },
      B4: {
        label: 'Déclarations Fiscales et Travaux de Fin d\'Année',
        description: `Préparation et dépôt des déclarations fiscales annuelles (IS, Bilan fiscal)
Établissement des liasses fiscales
Gestion des obligations périodiques (TVA, déclaration des salaires, etc.)`
      },
      B5: {
        label: 'Contentieux Fiscal et Relation avec l\'Administration',
        description: `Assistance lors d'un contrôle fiscal de la Direction Générale des Impôts (DGI)
Rédaction de réclamations et de recours contentieux
Procédure de rescrit fiscal (demande d'avis préalable à l'administration)
Négociation de plans de paiement (délais, étalement)`
      },
      B6: {
        label: 'Fiscalité Internationale et Douane',
        description: `Conseils en matière de prix de transfert
Optimisation de la chaîne de valeur et des opérations transfrontalières
Conseils en droit douanier guinéen et contentieux douanier`
      },
      B7: {
        label: 'Formation en Fiscalité',
        description: `Formation sur la fiscalité des entreprises en Guinée (IS, TVA, droits d'accises)
Ateliers sur l'optimisation fiscale légale et la conformité
Formation spécifique sur le Code Minier et les incitations fiscales
Sensibilisation aux risques contentieux et aux procédures de contrôle
Formation sur la fiscalité internationale et les prix de transfert`
      },
    },
  },
  C: {
    label: 'Droit des Affaires Spécialisé',
    prestations: {
      C1: {
        label: 'Droit Minier, Pétrolier et Énergétique',
        description: `Conseil sur le Code Minier et le Code Pétrolier guinéens
Négociation et rédaction de conventions de base, de contrats de partage de production
Accompagnement dans les relations avec les autorités (ANAM, etc.)
Conseils en responsabilité sociale des entreprises (RSE)`
      },
      C2: {
        label: 'Droit des Marchés Publics',
        description: `Analyse des appels d'offres
Préparation des dossiers de candidature et d'offres
Assistance dans les recours contentieux précontractuels et contractuels`
      },
      C3: {
        label: 'Droit Immobilier, Foncier & Construction',
        description: `Conseils en droit foncier guinéen (titres de propriété, certificat de détention coutumière)
Négociation et rédaction de baux commerciaux et professionnels
Conseils en droit de l'urbanisme et permis de construire
Rédaction de contrats de promotion immobilière et de construction`
      },
      C4: {
        label: 'Conformité & Règlementation',
        description: `Mise en conformité RGPD / Loi sur la protection des données
Lutte contre la corruption et le blanchiment (Conformité LCB-FT)
Audit de conformité réglementaire sectoriel`
      },
      C5: {
        label: 'Formations Sectorielles Spécialisées',
        description: `Formation sur le droit minier et pétrolier guinéen
Ateliers sur les marchés publics et les appels d'offres
Formation en droit immobilier et foncier en Guinée
Sensibilisation à la conformité sectorielle (RGPD, anti-corruption)
Formation sur la RSE et le droit environnemental`
      },
    },
  },
  D: {
    label: 'Contentieux & Résolution des Litiges',
    prestations: {
      D1: {
        label: 'Contentieux Commercial et Civil',
        description: `Représentation devant les tribunaux de commerce et les juridictions civiles
Rédaction d'assignations, de conclusions et de mémoires
Recouvrement de créances contentieuses`
      },
      D2: {
        label: 'Contentieux Administratif et Public',
        description: `Litiges avec les administrations et les collectivités locales
Recours pour excès de pouvoir`
      },
      D3: {
        label: 'Modes Alternatifs de Règlement des Litiges (MARD)',
        description: `Négociation et transaction
Médiation et arbitrage (notamment CIRCI)`
      },
      D4: {
        label: 'Assistance en Contentieux Juridique',
        description: `Analyse et évaluation des risques contentieux
Élaboration de stratégies de défense et de négociation
Assistance dans la préparation des dossiers de contentieux
Coordination avec les avocats et conseils externes
Suivi et reporting sur l\'avancement des procédures`
      },
      D5: {
        label: 'Formation en Contentieux et Gestion des Litiges',
        description: `Formation sur les procédures contentieuses devant les juridictions guinéennes
Ateliers sur les techniques de négociation et de médiation
Formation à la gestion stratégique des litiges
Sensibilisation aux modes alternatifs de résolution des conflits
Formation sur la préparation des dossiers de contentieux`
      },
    },
  },
  E: {
    label: 'Missions Transverses & Consulting Stratégique',
    prestations: {
      E1: {
        label: 'Audit Juridique et Due Diligence Globale',
        description: `Audit juridique et fiscal complet d'une société
Due diligence intégrée (juridique, fiscale, sociale) pour opération de fusion-acquisition
Coordination des différentes expertises (juridique, fiscale, comptable)
Évaluation globale des risques et opportunités
Recommandations stratégiques pour la sécurisation des opérations`
      },
      E2: {
        label: 'Conseil aux Investisseurs Étrangers',
        description: `Accompagnement dans l'entrée sur le marché guinéen
Conseils sur le Code des Investissements et les autorisations spécifiques
Assistance dans le montage des dossiers d'investissement
Due diligence pré-investissement`
      },
      E3: {
        label: 'Conseil en Restructuration et Transmission',
        description: `Conseil pour la transmission d'entreprise (cession, donation)
Optimisation juridique et fiscale de la restructuration d'un groupe
Due diligence préalable à la transmission
Audit de valorisation et conseil en pricing`
      },
      E4: {
        label: 'Formation en Consulting Juridique Stratégique',
        description: `Formation sur les techniques d'audit juridique et de due diligence
Ateliers sur l'accompagnement des investisseurs étrangers
Formation en stratégie de restructuration et transmission d'entreprise
Sensibilisation aux enjeux du consulting stratégique en droit des affaires
Formation adaptée aux conseils d'administration et comités stratégiques`
      },
    },
  },
  F: {
    label: 'Interne & Administration',
    prestations: {
      F1: {
        label: 'Développement Commercial et Stratégie',
        description: `Stratégie commerciale, analyse de marché, définition des offres et tarifs
Participation à des salons et conférences en tant qu'exposant
Prospection active, rendez-vous et networking
Préparation de propositions commerciales (pitchs et RFPs)
Réunions de briefing/débriefing client`
      },
      F2: {
        label: 'Gestion des Ressources Humaines',
        description: `Rédaction de fiches de poste, analyse de CV, entretiens d'embauche
Intégration et formation des nouveaux collaborateurs
Gestion des congés, absences et évaluations annuelles
Gestion des conflits internes`
      },
      F3: {
        label: 'Gestion Administrative et Financière',
        description: `Facturation clients et relance des impayés
Gestion de la trésorerie, paie et charges sociales
Paiement des fournisseurs et gestion budgétaire
Déclarations fiscales du cabinet et clôture comptable
Gestion et mise à jour des dossiers clients
Travaux de secrétariat juridique (tenue des registres légaux)`
      },
      F4: {
        label: 'Veille, Formation et Connaissances',
        description: `Formations internes et externes
Veille juridique et fiscale générale
Rédaction d'articles, fiches pratiques et guides méthodologiques
Recherche juridique et analyse de jurisprudence`
      },
      F5: {
        label: 'Management et Réunions Internes',
        description: `Réunions de comité de direction et associés
Réunions stratégiques sur l'avenir du cabinet
Planification et répartition des missions
Réunions de brief/débrief d'équipe
Contrôle qualité interne et relecture croisée`
      },
      F6: {
        label: 'Gestion Informatique et Infrastructure',
        description: `Gestion et maintenance du parc informatique
Administration du logiciel de gestion des temps et missions
Cybersécurité et sauvegarde des données
Gestion des locaux, équipements et fournitures`
      },
      F7: {
        label: 'Formation Interne et Développement des Compétences',
        description: `Formation continue des collaborateurs du cabinet
Organisation de séminaires et ateliers de perfectionnement
Développement des compétences managériales et commerciales
Tutorat et accompagnement des jeunes collaborateurs
Programmes de formation sur les outils et processus internes`
      },
      F8: {
        label: 'Congés, Absences et Divers',
        description: `Gestion des pauses, congés et absences maladie
Temps d'inactivité non imputable à un client
Tâches personnelles et gestion d'emails non liés aux dossiers`
      }
    }
  },
  G: {
    label: 'Global Compliance Services (GCS)',
    prestations: {
      G1: {
        label: 'Tenue de la Comptabilité',
        description: `Prise en charge complète et externalisée de la fonction comptable
Saisie et enregistrement des pièces comptables (factures clients et fournisseurs, notes de frais, relevés bancaires)
Lettrage et rapprochement bancaire mensuel ou trimestriel
Gestion et suivi comptable des immobilisations (amortissements, dépréciations)
Comptabilisation des paies et des charges sociales
Établissement des déclarations de TVA périodiques
Tenue et mise à jour des grands livres, journaux auxiliaires et général`
      },
      G2: {
        label: 'Inventaires Annuels ou Revue des Comptes',
        description: `Travaux de préparation et de vérification approfondie des comptes annuels
Analyse et justification des soldes de tous les comptes du bilan
Contrôle de l'exactitude physique et comptable des stocks
Vérification de la validité et de l'évaluation des immobilisations
Identification et justification des écritures d'inventaire nécessaires
Préparation des annexes et états de synthèse pour l'audit`
      },
      G3: {
        label: 'Élaboration des États Financiers',
        description: `Production formalisée des états financiers de fin d'exercice conformément au référentiel comptable (SYSCOHADA)
Établissement du Bilan, Compte de Résultat et Tableau des Flux de Trésorerie
Préparation des notes annexes détaillant les méthodes comptables
Mise en forme professionnelle et présentation des états pour approbation
Aggrégation et structuration des données issues de la comptabilité`
      },
      G4: {
        label: 'Paramétrage et Mise en Place de la Comptabilité dans le Logiciel Sage',
        description: `Conseil et assistance technique pour l'installation et la configuration du logiciel Sage
Analyse des besoins et de la structure de l'entreprise
Conception et paramétrage du plan comptable général et des plans auxiliaires
Configuration des journaux comptables, des modèles d'écriture et des tableaux de bord
Formation du personnel à l'utilisation du logiciel
Assistance au démarrage et suivi post-lancement`
      },
      G5: {
        label: 'Élaboration de Bilan d\'Ouverture',
        description: `Création du bilan initial d'une nouvelle société ou lors d'un changement de logiciel
Recensement et évaluation de tous les éléments d'actif et de passif à la date d'ouverture
Calcul des capitaux propres initiaux
Saisie du bilan d'ouverture dans le logiciel comptable pour initialiser les soldes
Rédaction d'une note justificative des valuations retenues`
      },
      G6: {
        label: 'Conseil aux Problématiques Comptables',
        description: `Prestation d'expertise ponctuelle pour répondre à des questions techniques spécifiques
Analyse de la problématique posée par le client
Recherche et interprétation de la norme comptable applicable (SYSCOHADA)
Rédaction d'une note de conseil argumentée
Présentation orale et recommandations opérationnelles
Proposition d'écriture comptable corrective si nécessaire`
      },
      G7: {
        label: 'Formation en Comptabilité et Fiscalité',
        description: `Formation sur les principes comptables SYSCOHADA et leur application
Ateliers pratiques sur la tenue de comptabilité et l'établissement des états financiers
Formation sur les déclarations fiscales et les obligations périodiques
Sensibilisation aux normes comptables internationales (IFRS)
Formation sur l'utilisation des logiciels comptables (Sage, etc.)
Programmes de formation adaptés aux responsables comptables et financiers`
      },
    },
  },
}
export type MissionCatalogType = {
  [categoryCode: string]: {
    label: string
    prestations: {
      [prestationCode: string]: {
        label: string
        description: string
      }
    }
  }
}
