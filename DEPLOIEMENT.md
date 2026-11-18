# Déploiement

Suivi des demandes de formation grand public pour **La Cloche**, association de lutte contre
l'exclusion sociale. L'outil remplace les points individuels par un pipeline partagé : une
demande avance d'étape en étape jusqu'à la session de formation.

## Services

- `frontend/` — Next.js en export statique, servi par nginx sur le port 80 (8080 publié). **Service exposé au public.**
- `api/` — Node (TypeScript exécuté directement), écoute sur le port 8081 (publié). Appelée par le front en chemin relatif (`/api/v1/...`).

## Services externes

Aucun pour l'instant (itération 1) : pas de base de données, pas de stockage, pas d'appel à un modèle d'IA. Les données affichées sont en dur dans `api/src/routes.ts`.

## Connu comme fragile ou inachevé

- **Aucune persistance** : les demandes sont codées en dur côté API, en mémoire. Rien n'est encore écrit par l'utilisateur ; ce point change dès l'itération 2 (saisie d'une demande) et devra alors passer par un stockage qui survit à un redémarrage.
- Seul l'écran « Mes demandes » (liste) est construit. La saisie, la fiche demande, la création de session, le suivi post-session et la vue Pipeline de la direction restent à construire (voir `ITERATIONS.md`).
- Le lien vers la vue Pipeline, visible en bas de l'écran, n'est pas encore cliquable.

## Contacts

- Équipe : Équipe 40 (eXaltemps Solidaire, hackathon du 2026-11-18).
- Association : La Cloche — contact à préciser avec les cadreurs.
