"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../page.module.css";

export default function NouvelleDemande() {
  const router = useRouter();
  const [organisme, setOrganisme] = useState("");
  const [typeOrganisme, setTypeOrganisme] = useState("entreprise");
  const [contact, setContact] = useState("");
  const [origine, setOrigine] = useState("Demande entrante");
  const [participants, setParticipants] = useState("");
  const [notes, setNotes] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function soumettre(evenement: React.FormEvent) {
    evenement.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      const reponse = await fetch("/api/v1/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organisme,
          typeOrganisme,
          contact,
          origine,
          participants: participants ? Number(participants) : undefined,
          notes,
        }),
      });
      if (!reponse.ok) {
        const corps = await reponse.json().catch(() => ({}));
        setErreur(corps.erreur ?? "La demande n'a pas pu être créée.");
        return;
      }
      router.push("/");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.screen}>
        <div className={styles.topbar}>
          <button className={styles.topbarBack} type="button" onClick={() => router.push("/")}>
            ‹
          </button>
          <div style={{ flex: 1 }}>
            <div className={styles.topbarTitle}>Nouvelle demande</div>
            <span className={styles.topbarSub}>Saisie en 1 minute</span>
          </div>
        </div>

        <div className={styles.content}>
          <form className={styles.form} onSubmit={soumettre}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Organisme</label>
              <input
                className={styles.formInput}
                type="text"
                value={organisme}
                onChange={(e) => setOrganisme(e.target.value)}
                placeholder="Nom de l'organisme"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Type d&apos;organisme</label>
              <select
                className={styles.formSelect}
                value={typeOrganisme}
                onChange={(e) => setTypeOrganisme(e.target.value)}
              >
                <option value="entreprise">Entreprise</option>
                <option value="collectivite">Collectivité</option>
                <option value="ecole">École</option>
                <option value="association">Association</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Contact principal</label>
              <input
                className={styles.formInput}
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Nom du contact"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Origine de la demande</label>
              <select className={styles.formSelect} value={origine} onChange={(e) => setOrigine(e.target.value)}>
                <option>Demande entrante</option>
                <option>Prospection La Cloche</option>
                <option>Commande d&apos;une collectivité</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Participants annoncé·es</label>
              <input
                className={styles.formInput}
                type="number"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Nombre estimé"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Notes</label>
              <textarea
                className={styles.formTextarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contexte, besoins spécifiques…"
              />
            </div>

            {erreur && <p className={styles.formErreur}>{erreur}</p>}

            <p className={styles.formHint}>
              La demande sera créée à l&apos;étape « Nouvelle demande », avec vous comme référent·e.
            </p>

            <button className={styles.btnPrimary} type="submit" disabled={envoi}>
              Créer la demande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
