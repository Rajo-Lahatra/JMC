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
        label: 'Fusions-Acquisitions & Restructurations',
        description: `Due diligence juridique (audit d'acquisition)
Structuration d'opérations (fusion, scission, apport d'actifs)
Négociation des garanties de passif et des clauses contractuelles
Conseils sur les procédures de licenciement collectif (si applicable)`
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
        label: 'Déclarations Fiscales et Travaux de Fin d\'Année',
        description: `Préparation et dépôt des déclarations fiscales annuelles (IS, Bilan fiscal)
Établissement des liasses fiscales
Gestion des obligations périodiques (TVA, déclaration des salaires, etc.)`
      },
      B3: {
        label: 'Contentieux Fiscal et Relation avec l\'Administration',
        description: `Assistance lors d'un contrôle fiscal de la Direction Générale des Impôts (DGI)
Rédaction de réclamations et de recours contentieux
Procédure de rescrit fiscal (demande d'avis préalable à l'administration)
Négociation de plans de paiement (délais, étalement)`
      },
      B4: {
        label: 'Fiscalité Internationale et Douane',
        description: `Conseils en matière de prix de transfert
Optimisation de la chaîne de valeur et des opérations transfrontalières
Conseils en droit douanier guinéen et contentieux douanier`
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
    },
  },
  E: {
    label: 'Missions Transverses & Consulting Stratégique',
    prestations: {
      E1: {
        label: 'Audit Juridique et Due Diligence',
        description: `Audit juridique et fiscal complet d'une société
Due diligence pour opération de fusion-acquisition ou investissement`
      },
      E2: {
        label: 'Conseil aux Investisseurs Étrangers',
        description: `Accompagnement dans l'entrée sur le marché guinéen
Conseils sur le Code des Investissements et les autorisations spécifiques`
      },
      E3: {
        label: 'Conseil en Restructuration et Transmission',
        description: `Conseil pour la transmission d'entreprise (cession, donation)
Optimisation juridique et fiscale de la restructuration d'un groupe`
      },
    },
  },
  F: {
    label: 'Missions Internes & Administratives',
    prestations: {
      F1: {
        label: 'Réunions Internes & Développement d\'Affaires',
        description: `Réunion de briefing / débriefing client
Préparation de propositions commerciales (proposals)
Recherche juridique et analyse de la jurisprudence
Formation interne / veille juridique et fiscale`
      },
      F2: {
        label: 'Gestion et Administration',
        description: `Gestion et mise à jour des dossiers clients
Travaux de secrétariat juridique (tenue des registres légaux)`
      },
    },
  },

G: {
    label: 'INTERNE – Non Facturable',
    prestations: {
      G1: {
        label: 'Développement Commercial',
        description: `Stratégie commerciale, analyse de marché, définition des offres, participation à des salons, prospection, rendez-vous, networking, newsletters, pitchs et propositions commerciales.`
      },
      G2: {
        label: 'Gestion RH (Recrutement, Formation)',
        description: `Fiches de poste, analyse de CV, entretiens, intégration, formation interne, gestion des congés et absences, évaluations annuelles, gestion des conflits.`
      },
      G3: {
        label: 'Gestion Administrative & Financière',
        description: `Facturation, relances, trésorerie, paie, fournisseurs, budget, déclarations fiscales, clôture comptable, travail avec l’expert-comptable.`
      },
      G4: {
        label: 'Veille & Formation',
        description: `Formations internes/externes, veille juridique et fiscale, rédaction de guides et supports, production de connaissances.`
      },
      G5: {
        label: 'Réunions de Direction & Management',
        description: `Comité de direction, réunions stratégiques, planification des missions, brief/débrief d’équipe, contrôle qualité interne.`
      },
      G6: {
        label: 'Congés / Absences',
        description: `Pauses, congés, maladie, temps d’inactivité non imputable à un client.`
      },
      G7: {
        label: 'Divers',
        description: `Tâches personnelles, gestion d’e-mails non liés à un dossier client.`
      }
    }
  },
H: {
    label: 'Global Compliance Services (GCS)',
    prestations: {
      H1: {
        label: 'Tenue de la Comptabilité',
        description: `Prise en charge complète et externalisée de la fonction comptable
Saisie et enregistrement des pièces comptables (factures clients et fournisseurs, notes de frais, relevés bancaires)
Lettrage et rapprochement bancaire mensuel ou trimestriel
Gestion et suivi comptable des immobilisations (amortissements, dépréciations)
Comptabilisation des paies et des charges sociales
Établissement des déclarations de TVA périodiques
Tenue et mise à jour des grands livres, journaux auxiliaires et général`
      },
      H2: {
        label: 'Inventaires Annuels ou Revue des Comptes',
        description: `Travaux de préparation et de vérification approfondie des comptes annuels
Analyse et justification des soldes de tous les comptes du bilan
Contrôle de l'exactitude physique et comptable des stocks
Vérification de la validité et de l'évaluation des immobilisations
Identification et justification des écritures d'inventaire nécessaires
Préparation des annexes et états de synthèse pour l'audit`
      },
      H3: {
        label: 'Élaboration des États Financiers',
        description: `Production formalisée des états financiers de fin d'exercice conformément au référentiel comptable (SYSCOHADA)
Établissement du Bilan, Compte de Résultat et Tableau des Flux de Trésorerie
Préparation des notes annexes détaillant les méthodes comptables
Mise en forme professionnelle et présentation des états pour approbation
Aggrégation et structuration des données issues de la comptabilité`
      },
      H4: {
        label: 'Paramétrage et Mise en Place de la Comptabilité dans le Logiciel Sage',
        description: `Conseil et assistance technique pour l'installation et la configuration du logiciel Sage
Analyse des besoins et de la structure de l'entreprise
Conception et paramétrage du plan comptable général et des plans auxiliaires
Configuration des journaux comptables, des modèles d'écriture et des tableaux de bord
Formation du personnel à l'utilisation du logiciel
Assistance au démarrage et suivi post-lancement`
      },
      H5: {
        label: 'Élaboration de Bilan d\'Ouverture',
        description: `Création du bilan initial d'une nouvelle société ou lors d'un changement de logiciel
Recensement et évaluation de tous les éléments d'actif et de passif à la date d'ouverture
Calcul des capitaux propres initiaux
Saisie du bilan d'ouverture dans le logiciel comptable pour initialiser les soldes
Rédaction d'une note justificative des valuations retenues`
      },
      H6: {
        label: 'Conseil aux Problématiques Comptables',
        description: `Prestation d'expertise ponctuelle pour répondre à des questions techniques spécifiques
Analyse de la problématique posée par le client
Recherche et interprétation de la norme comptable applicable (SYSCOHADA)
Rédaction d'une note de conseil argumentée
Présentation orale et recommandations opérationnelles
Proposition d'écriture comptable corrective si nécessaire`
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
