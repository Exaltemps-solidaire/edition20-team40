"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type TypeOrganisme = "entreprise" | "collectivite" | "ecole" | "association";

type Demande = {
  id: string;
  organisme: string;
  typeOrganisme: TypeOrganisme;
  etape: string;
  module: string;
  participants: number;
  anciennete: string;
  statutDevis: "envoye" | "signe" | "sans_objet" | null;
  groupe: "en_cours" | "session_creee";
};

const ETIQUETTES: Record<TypeOrganisme, { texte: string; classe: string }> = {
  entreprise: { texte: "Entreprise", classe: styles.tagEntreprise },
  collectivite: { texte: "Collectivité", classe: styles.tagCollectivite },
  ecole: { texte: "École", classe: styles.tagEcole },
  association: { texte: "Association", classe: styles.tagAssociation },
};

const STATUTS_DEVIS: Record<NonNullable<Demande["statutDevis"]>, string> = {
  envoye: "Devis envoyé",
  signe: "Devis signé",
  sans_objet: "Sans objet",
};

function DemandRow({ demande }: { demande: Demande }) {
  const etiquette = ETIQUETTES[demande.typeOrganisme];
  const statut = demande.statutDevis ? ` · ${STATUTS_DEVIS[demande.statutDevis]}` : "";
  return (
    <div className={styles.demandRow}>
      <div>
        <div className={styles.demandRowOrg}>{demande.organisme}</div>
        <div className={styles.demandRowStep}>
          <span className={`${styles.tag} ${etiquette.classe}`}>{etiquette.texte}</span>
        </div>
        <div className={styles.demandRowStep}>
          Étape : <strong>{demande.etape}</strong>
          {statut}
        </div>
        <div className={styles.demandRowStep}>
          {demande.module} · {demande.participants} pers. · {demande.anciennete}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [demandes, setDemandes] = useState<Demande[] | null>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    fetch("/api/v1/demandes")
      .then((reponse) => {
        if (!reponse.ok) throw new Error(`statut ${reponse.status}`);
        return reponse.json();
      })
      .then((donnees: { demandes: Demande[] }) => setDemandes(donnees.demandes))
      .catch(() => setErreur(true));
  }, []);

  const enCours = demandes?.filter((d) => d.groupe === "en_cours") ?? [];
  const sessionsCreees = demandes?.filter((d) => d.groupe === "session_creee") ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.screen}>
        <div className={styles.topbar}>
          <div style={{ flex: 1 }}>
            <div className={styles.topbarTitle}>Mes demandes</div>
            <span className={styles.topbarSub}>Antenne Île-de-France · Sophie A.</span>
          </div>
          <button className={styles.topbarAction} type="button" onClick={() => router.push("/nouvelle-demande")}>
            + Nouvelle
          </button>
        </div>

        <div className={styles.content}>
          {erreur && <p className={styles.etat}>Impossible de charger les demandes.</p>}
          {!demandes && !erreur && <p className={styles.etat}>Chargement…</p>}

          {demandes && (
            <>
              <div>
                <div className={styles.sectionTitle}>En cours · {enCours.length} demandes</div>
                <div className={styles.demandList}>
                  {enCours.map((demande) => (
                    <DemandRow key={demande.id} demande={demande} />
                  ))}
                </div>
              </div>

              <div>
                <div className={styles.sectionTitle}>Sessions créées · {sessionsCreees.length}</div>
                <div className={styles.demandList}>
                  {sessionsCreees.map((demande) => (
                    <DemandRow key={demande.id} demande={demande} />
                  ))}
                </div>
              </div>

              <div className={styles.lienPipeline}>
                <div>
                  <div>Vue Pipeline — toutes les antennes</div>
                  <div className={styles.lienPipelineSub}>Réservée à la directrice du développement</div>
                </div>
                <span>›</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
