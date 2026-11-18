// Routage de l'API, sans dépendance : une fonction pure, testable sans démarrer de serveur.
// Le proxy d'entrée envoie /api/... à ce service sans retirer le préfixe : les routes métier
// se déclarent donc sous /api/v1/... ; /health et /sante restent à la racine (port 8081).

export type Reponse = { statut: number; corps?: unknown };

export type TypeOrganisme = "entreprise" | "collectivite" | "ecole" | "association";
export type StatutDevis = "envoye" | "signe" | "sans_objet" | null;

export type Demande = {
  id: string;
  organisme: string;
  typeOrganisme: TypeOrganisme;
  etape: string;
  module: string;
  participants: number;
  anciennete: string;
  statutDevis: StatutDevis;
  groupe: "en_cours" | "session_creee";
};

// Données en dur pour l'itération 1 : reprises de passation/prototype/index.html (screen-1).
export const demandes: Demande[] = [
  {
    id: "d1",
    organisme: "Groupe Renault Trucks",
    typeOrganisme: "entreprise",
    etape: "Module proposé",
    module: "Fresque de la rue",
    participants: 25,
    anciennete: "il y a 5 j.",
    statutDevis: "envoye",
    groupe: "en_cours",
  },
  {
    id: "d2",
    organisme: "Mairie de Montreuil",
    typeOrganisme: "collectivite",
    etape: "Devis signé / Commande",
    module: "Form'Action",
    participants: 18,
    anciennete: "il y a 2 j.",
    statutDevis: "sans_objet",
    groupe: "en_cours",
  },
  {
    id: "d3",
    organisme: "Lycée Hélène Boucher",
    typeOrganisme: "ecole",
    etape: "Premier échange",
    module: "Fresque de la rue",
    participants: 30,
    anciennete: "il y a 1 j.",
    statutDevis: null,
    groupe: "en_cours",
  },
  {
    id: "d4",
    organisme: "Fondation Abbé Pierre",
    typeOrganisme: "association",
    etape: "Nouvelle demande",
    module: "Module à définir",
    participants: 12,
    anciennete: "aujourd'hui",
    statutDevis: null,
    groupe: "en_cours",
  },
  {
    id: "d5",
    organisme: "Caisse des Dépôts",
    typeOrganisme: "entreprise",
    etape: "Session créée",
    module: "Cluedo",
    participants: 40,
    anciennete: "14 janv. 2027",
    statutDevis: "envoye",
    groupe: "session_creee",
  },
];

export function router(methode: string, url: string): Reponse {
  const chemin = new URL(url, "http://api").pathname;
  if (methode === "GET" && (chemin === "/health" || chemin === "/sante")) {
    return { statut: 200, corps: { status: "ok" } };
  }
  if (methode === "GET" && chemin === "/api/v1/demandes") {
    return { statut: 200, corps: { demandes } };
  }
  return { statut: 404 };
}
