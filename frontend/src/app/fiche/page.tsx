"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styles from "../page.module.css";

type TypeOrganisme = "entreprise" | "collectivite" | "ecole" | "association";
type StatutDevis = "envoye" | "signe" | "sans_objet";

type Demande = {
  id: string;
  organisme: string;
  typeOrganisme: TypeOrganisme;
  etape: string;
  module: string;
  participants: number;
  anciennete: string;
  statutDevis: StatutDevis | null;
  groupe: "en_cours" | "session_creee";
};

const ETAPES = ["Nouvelle demande", "Premier échange", "Module proposé", "Devis signé / Commande", "Session créée"];
const MODULES = ["Module à définir", "Fresque de la rue", "Form'Action", "Cluedo"];
const STATUTS: { valeur: StatutDevis; texte: string }[] = [
  { valeur: "envoye", texte: "Envoyé" },
  { valeur: "signe", texte: "Signé" },
  { valeur: "sans_objet", texte: "Sans objet" },
];

function FicheDemande() {
  const router = useRouter();
  const id = useSearchParams().get("id");
  const [demande, setDemande] = useState<Demande | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/demandes/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { demande: Demande }) => setDemande(d.demande))
      .catch(() => setErreur("Demande introuvable."));
  }, [id]);

  async function modifier(corps: Partial<Pick<Demande, "etape" | "module" | "statutDevis">>) {
    if (!id) return;
    const reponse = await fetch(`/api/v1/demandes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corps),
    });
    const corpsReponse = await reponse.json();
    if (!reponse.ok) {
      setErreur(corpsReponse.erreur ?? "La modification a échoué.");
      return;
    }
    setErreur(null);
    setDemande(corpsReponse.demande);
  }

  if (erreur && !demande) {
    return (
      <div className={styles.page}>
        <div className={styles.screen}>
          <p className={styles.etat}>{erreur}</p>
        </div>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className={styles.page}>
        <div className={styles.screen}>
          <p className={styles.etat}>Chargement…</p>
        </div>
      </div>
    );
  }

  const collectivite = demande.typeOrganisme === "collectivite";

  return (
    <div className={styles.page}>
      <div className={styles.screen}>
        <div className={styles.topbar}>
          <button className={styles.topbarBack} type="button" onClick={() => router.push("/")}>
            ‹
          </button>
          <div style={{ flex: 1 }}>
            <div className={styles.topbarTitle}>{demande.organisme}</div>
            <span className={styles.topbarSub}>{demande.module}</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Étape</label>
            <select
              className={styles.formSelect}
              value={demande.etape}
              onChange={(e) => modifier({ etape: e.target.value })}
            >
              {ETAPES.map((etape) => (
                <option key={etape} value={etape}>
                  {etape}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Module</label>
            <select
              className={styles.formSelect}
              value={demande.module}
              onChange={(e) => modifier({ module: e.target.value })}
            >
              {MODULES.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Statut du devis</label>
            <select
              className={styles.formSelect}
              value={demande.statutDevis ?? "envoye"}
              disabled={collectivite}
              onChange={(e) => modifier({ statutDevis: e.target.value as StatutDevis })}
            >
              {STATUTS.map((statut) => (
                <option key={statut.valeur} value={statut.valeur}>
                  {statut.texte}
                </option>
              ))}
            </select>
            {collectivite && <p className={styles.formHint}>Collectivité : pas de facturation, devis sans objet.</p>}
          </div>

          {erreur && <p className={styles.formErreur}>{erreur}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <div className={styles.screen}>
            <p className={styles.etat}>Chargement…</p>
          </div>
        </div>
      }
    >
      <FicheDemande />
    </Suspense>
  );
}
