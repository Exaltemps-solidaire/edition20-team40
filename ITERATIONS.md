# Plan d'itérations — La Cloche, suivi des demandes de formation

- **Plan validé le 2026-11-18** par le développeur.
- **Source du plan** : proposé par l'agent, à partir de `passation/cadrage/6-plan-de-livraison.md` (le plan de livraison de l'équipe) et du prototype retenu (`passation/prototype/index.html`). L'équipe n'a pas déposé de plan d'itérations dans PM Lab (pas de fichier `cadrage/*iteration*`, pas de clé `iterations` dans `passation.json`).
- **Temps restant annoncé** : ≥ 90 minutes, demandé le 2026-11-18 à 16:37. Reconfirmé à 40 minutes au début de l'itération 1 (2026-11-18, reprise de session) : la plateforme n'avait pas encore été démarrée, elle est relancée en tâche de fond pendant la vérification de la DoD. Reconfirmé à 40 minutes au début de l'itération 2 (2026-11-18, ~17:37) : plateforme et registre déjà démarrés, donc moins de temps non-codage à prévoir que pour l'itération 1. Reconfirmé à 40 minutes au début de l'itération 3 (2026-11-18, ~17:45).
- **Durée d'un tour de test de l'équipe** : 5 minutes.
- **Capacité d'une itération** : codage (≤10 min) + publication (~5 min) + tour de test (~5 min) ≈ 20 min. Sur ≥90 minutes, le plan ci-dessous tient large (6 itérations détaillées au fil de l'eau ≈ 2h au pire), avec de la marge pour un dépassement ou une itération de stabilisation finale. Le temps restant sera redemandé au début de chaque itération : ce découpage sera révisé s'il se réduit.
- **Hors périmètre** (repris du PRD, `passation/cadrage/7-prd.md`) : rédaction du devis/facture, déclaration Qualiopi, inscription d'un particulier, noms des participants d'une sensibilisation sur devis, filtres autres que « par antenne » dans la vue Pipeline, connexion/comptes/mots de passe.

⚠️ **Écart entre le PRD et le prototype, à trancher par les cadreurs** : le PRD (`7-prd.md`) décrit un écran « Qui êtes-vous ? » au lancement, avec un bouton pour changer de persona à tout moment. Le prototype retenu (`prototype/index.html`) ne montre pas cet écran : la topbar affiche un rôle fixe (« Sophie A. », responsable d'antenne Île-de-France), et l'accès à la vue direction se fait par un simple lien, pas par un changement de rôle. Comme la consigne est de reproduire le prototype sans le réinventer, ce plan **suit le prototype** (persona fixe) et ne construit pas le sélecteur de rôle. ❓ À confirmer avec les cadreurs si le sélecteur de persona est nécessaire pour le tour de test ; si oui, ce sera une itération à part entière (~5 min de codage, un seul écran).

---

## Itération 1 : le squelette publié, avec la liste des demandes de la responsable d'antenne

- **Dans le périmètre** :
  - `.env.example` et `DEPLOIEMENT.md` à la racine (contrat de déployabilité, point 2 et 8).
  - L'écran `Mes demandes` (screen-1 du prototype) remplace la page Next.js par défaut : topbar « Mes demandes » / « Antenne Île-de-France · Sophie A. », liste de demandes avec organisme, type, étape, ancienneté — données en dur côté API (pas de saisie encore).
  - Une route `GET /api/v1/demandes` sur l'API (8081) qui renvoie ces données en dur ; le front les affiche via un appel relatif (`/api/v1/demandes`).
- **Hors périmètre** : la saisie d'une nouvelle demande, la fiche demande, la vue Pipeline — itérations suivantes.
- **Critères d'acceptation** :
  - Étant donné l'application déployée, quand on ouvre `/`, alors on voit la liste des demandes de Sophie A. avec au moins 2 demandes d'exemple (une entreprise, une collectivité).
  - Étant donné le front, quand il appelle l'API, alors l'appel se fait en chemin relatif (`/api/v1/demandes`), sans URL absolue.
  - Étant donné l'application déployée, quand on appelle `/health` et `/sante` sur les deux services, alors les deux répondent `200` avec un corps vérifiable.
- **Hypothèse de l'équipe couverte** : aucune hypothèse formelle fournie (`cadrage/5-hypotheses.md` est vide). L'itération couvre la première « valeur mesurée » du plan de livraison : « une demande peut être saisie et mise à jour sans sortir de l'outil » (partie lecture seule pour l'instant).
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `.env.example`, `DEPLOIEMENT.md`, `api/src/routes.ts`, `frontend/src/app/page.tsx`, `frontend/src/app/page.module.css`.
- **Tests unitaires prévus** : 1 à 2, sur `api/src/routes.ts` (la route `/api/v1/demandes` renvoie le bon statut et la forme attendue).
- **Étapes ajoutées à la démo** (`e2e/demo.spec.ts`) : ouvrir l'application, vérifier que la liste des demandes s'affiche.
- **Bilan** :
  - Codage déjà fait lors d'une session précédente (`.iterations/1.debut`/`1.fin`), repris ici pour la vérification, la publication et le signalement. Pas de dépassement constaté sur cette reprise.
  - **Critères satisfaits** : les 3 critères d'acceptation sont remplis — liste des 5 demandes d'exemple visible sur `/`, appel API en chemin relatif (`/api/v1/demandes`), `/health` et `/sante` répondent `200` avec un corps vérifiable sur les deux services (vérifié en local : `curl localhost:8080/{health,sante}` → `ok`, `curl localhost:8081/{health,sante}` → `{"status":"ok"}`).
  - **Tests** : 3 tests Vitest sur `api/src/routes.ts` (santé, 404, forme de `/api/v1/demandes`). `npm test` passe.
  - **Contrat de déployabilité** : `./scripts/verifier-deployabilite.sh` → aucune borne, aucune alarme.
  - **Déploiement** : plateforme core démarrée (elle ne tournait pas en reprise de session), base `team40` créée, images `api`/`frontend` construites et publiées sur `localhost:5000`, déployées via `podman compose -p team40`. Vérifié en local uniquement (voir ci-dessus) : `$URL_PUBLIQUE` reste injoignable depuis la machine par construction — à confirmer par le développeur dans son navigateur.
  - **Signalé à PM Lab** : `./scripts/signaler-version.sh 1` → version 1 enregistrée (`moteur_avance: false`).
  - **Démo** : étape ajoutée, mais son exécution locale (`BASE_URL=http://localhost:8080 npx playwright test`) échoue — attendu : la passerelle apisix qui route `/api/*` vers l'API par chemin n'est configurée que pour le domaine public réel, pas pour `localhost:8080` depuis la machine ; les appels directs à chaque service (8080 et 8081) fonctionnent. À rejouer par le développeur avec `BASE_URL=$URL_PUBLIQUE npm run demo` depuis son poste si souhaité — une démo qui échoue se signale, elle ne bloque pas la publication.
  - **Rien reporté** sur cette itération.
  - **Modifications** :
    - `api/src/routes.ts`, `api/src/server.ts` : route `GET /api/v1/demandes` (données en dur) et `/health`/`/sante` — sert le critère 1 et 3.
    - `frontend/src/app/page.tsx`, `page.module.css` : écran « Mes demandes » (screen-1), appel relatif à l'API — sert le critère 1 et 2.
    - `frontend/public/health`, `frontend/public/sante` : routes de santé statiques du front — sert le critère 3.
    - `.env.example`, `DEPLOIEMENT.md` : contrat de déployabilité, point 2/8 de la DoD.
    - `podman-compose.yml`, `api/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf` : déploiement sur 8080/8081.
    - `e2e/demo.spec.ts` : étape « je vois la liste des demandes ».

## Itération 2 : saisir une nouvelle demande

- **Dans le périmètre** : l'écran `Saisir une demande` (screen-2) : formulaire organisme (existant ou nouveau + type : collectivité/entreprise/école/association), contact, origine, participants annoncés, notes. À la validation, la demande est ajoutée à la liste de l'itération 1, à l'étape « Nouvelle demande », avec Sophie A. comme référente.
- **Hors périmètre** : faire avancer l'étape depuis la fiche (itération 3), la persistance en base (les données restent en mémoire côté API — à noter comme fragile dans `DEPLOIEMENT.md`).
- **Critères d'acceptation** :
  - Étant donné la liste des demandes, quand on clique sur « + Nouvelle » et qu'on remplit le formulaire, alors la demande apparaît dans la liste à l'étape « Nouvelle demande ».
  - Étant donné un organisme de type collectivité, quand la demande est créée, alors son statut de devis est directement « Sans objet ».
  - Étant donné un champ obligatoire vide (organisme, type, contact), quand on valide, alors le formulaire signale l'erreur sans créer de demande.
- **Hypothèse de l'équipe couverte** : aucune hypothèse formelle fournie ; couvre la valeur mesurée « une demande peut être saisie [...] sans sortir de l'outil ».
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `api/src/routes.ts` (POST `/api/v1/demandes`), un nouveau fichier de page/route front pour le formulaire, `frontend/src/app/page.tsx` (lien « + Nouvelle »).
- **Tests unitaires prévus** : 1 à 2, sur la règle « collectivité ⇒ devis Sans objet » et sur la validation des champs obligatoires.
- **Étapes ajoutées à la démo** : créer une demande entreprise, puis une demande collectivité, vérifier leur apparition dans la liste.
- **Bilan** :
  - Codage : 1 minute (plateforme et registre déjà démarrés depuis l'itération 1 ; pas de dépassement).
  - **Critères satisfaits** : les 3 — vérifié en local via l'API (POST d'une demande collectivité ⇒ `statutDevis: "sans_objet"`, `etape: "Nouvelle demande"` ; POST avec organisme vide ⇒ `400`, la demande n'apparaît pas dans la liste) et le front (`/nouvelle-demande` généré en statique, lien « + Nouvelle » actif, formulaire relié à l'API en chemin relatif).
  - **Tests** : 2 tests Vitest ajoutés sur `api/src/routes.ts` (collectivité ⇒ devis sans objet ; rejet si organisme/contact manquant, liste inchangée). 5 tests au total, tous passent.
  - **Contrat de déployabilité** : aucune borne, aucune alarme.
  - **Déploiement** : images reconstruites et publiées, `podman compose -p team40 up -d --force-recreate`. Vérifié en local (8080/8081) ; `$URL_PUBLIQUE` à confirmer par le développeur.
  - **Signalé à PM Lab** : version 2 enregistrée.
  - **Démo** : étape « Je saisis une nouvelle demande » ajoutée. Non rejouée depuis la machine, pour la même raison qu'en itération 1 (passerelle apisix sans route locale pour `/api/*` hors domaine public).
  - **Incident évité** : une tentative de lancer `node src/server.ts` en local pour un test rapide a échoué en `EADDRINUSE` sur le port 8080 — la variable d'environnement `PORT=8080` de la VM s'applique à tout processus Node lancé ici, y compris hors conteneur. Le conteneur frontend publié sur 8080 n'a pas été affecté (tentative avortée avant bind). Noté pour ne pas reproduire : tester via les conteneurs (build/push/compose), jamais un process Node nu sur cette VM.
  - **Rien reporté** sur cette itération.
  - **Modifications** :
    - `api/src/routes.ts` : `POST /api/v1/demandes` (validation + règle collectivité ⇒ devis sans objet) — sert les 3 critères.
    - `api/src/server.ts` : lecture du corps JSON des requêtes — sert le critère 1.
    - `frontend/src/app/nouvelle-demande/page.tsx` : nouvel écran de saisie (screen-2 du prototype) — sert le critère 1.
    - `frontend/src/app/page.module.css` : styles de formulaire partagés — sert le critère 1.
    - `frontend/src/app/page.tsx` : lien « + Nouvelle » actif vers `/nouvelle-demande` — sert le critère 1.
    - `e2e/demo.spec.ts` : étape de saisie.

## Itération 3 : faire avancer l'étape depuis la fiche demande

- **Dans le périmètre** : l'écran `Fiche demande` (screen-3/4) : ouvrir une demande depuis la liste, faire avancer l'étape (Premier échange → Module proposé, avec choix du module → Devis signé ou commande), mettre à jour le statut du devis (Envoyé / Signé / Sans objet) séparément de l'étape, pour une entreprise.
- **Hors périmètre** : le bouton « Créer la session » (itération 4), le suivi post-session, la vue Pipeline.
- **Critères d'acceptation** :
  - Étant donné une demande à l'étape « Nouvelle demande », quand la responsable la fait avancer jusqu'à « Module proposé », alors le module choisi est visible sur la fiche et dans la liste.
  - Étant donné une demande entreprise, quand le statut du devis passe à « Signé », alors l'étape de la demande peut passer à « Devis signé » indépendamment du statut devis affiché.
  - Étant donné une demande collectivité, quand on consulte sa fiche, alors le statut devis reste « Sans objet » et n'est pas modifiable.
- **Hypothèse de l'équipe couverte** : aucune hypothèse formelle fournie ; couvre la valeur mesurée « une demande peut être [...] mise à jour sans sortir de l'outil ».
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `api/src/routes.ts` (PATCH `/api/v1/demandes/:id`), nouvelle page/route front pour la fiche demande, lien depuis la liste (`frontend/src/app/page.tsx`).
- **Tests unitaires prévus** : 1 à 2, sur la transition d'étape et sur l'indépendance étape/statut devis.
- **Étapes ajoutées à la démo** : ouvrir une demande entreprise depuis la liste, la faire avancer jusqu'à « Devis signé ».
- **Bilan** :
  - Codage : durée exacte non mesurée (le chrono `.iterations/3.debut` a été écrit alors que le répertoire courant était passé à `frontend/`, le fichier s'est retrouvé au mauvais endroit ; reconstitué a posteriori avant la vérification). Qualitativement, dans le budget de 10 minutes, sans dépassement ni alarme déclenchée.
  - **Critères satisfaits** : les 3 — vérifié en local via l'API : `PATCH /api/v1/demandes/d3 {etape: "Module proposé", module: "Cluedo"}` ⇒ `200`, module et étape à jour (visibles aussi sur `GET /api/v1/demandes/d3`, donc dans la liste) ; `PATCH /api/v1/demandes/d1 {statutDevis: "signe"}` (sans toucher à l'étape) ⇒ `200`, `statutDevis: "signe"` indépendamment de l'étape ; `PATCH /api/v1/demandes/d2 {statutDevis: "envoye"}` (collectivité) ⇒ `400`, le devis reste `sans_objet` sur `GET`. Front : `/fiche?id=d1` répond `200`, affiche étape/module/statut devis avec le select de statut devis désactivé pour une collectivité.
  - **Tests** : 3 tests Vitest ajoutés sur `api/src/routes.ts` (PATCH étape+module, PATCH statut devis indépendant de l'étape, rejet PATCH statut devis sur collectivité). 8 tests au total, tous passent (`npm test`).
  - **Contrat de déployabilité** : `./scripts/verifier-deployabilite.sh` → aucune borne, aucune alarme.
  - **Déploiement** : images `api`/`frontend` reconstruites (nouvelle route statique `/fiche` générée par Next.js) et publiées sur `localhost:5000`, redéployées via `podman compose -p team40 up -d --force-recreate`. Vérifié en local (8080/8081, voir ci-dessus) ; `$URL_PUBLIQUE` à confirmer par le développeur dans son navigateur (`/health`, `/sante`).
  - **Signalé à PM Lab** : `./scripts/signaler-version.sh 3` → version 3 enregistrée (`moteur_avance: false`).
  - **Démo** : étape « J'ouvre une demande entreprise et je la fais avancer jusqu'à Devis signé » ajoutée. Non rejouée avec succès depuis la machine, pour la même raison structurelle qu'en itérations 1 et 2 (l'exécution s'arrête dès l'étape « liste des demandes », qui dépend déjà de `/api/v1/demandes` non routé en local) — à rejouer par le développeur avec `BASE_URL=$URL_PUBLIQUE npm run demo`.
  - **Rien reporté** sur les critères d'acceptation de cette itération.
  - **Modifications** :
    - `api/src/routes.ts` : `ETAPES`, `ModificationDemande`, `modifierDemande()`, route `PATCH /api/v1/demandes/:id` et `GET /api/v1/demandes/:id` — sert les 3 critères.
    - `frontend/src/app/fiche/page.tsx` : nouvel écran fiche demande (screen-3/4), lecture via `GET`, mise à jour via `PATCH`, statut devis désactivé pour une collectivité — sert les 3 critères.
    - `frontend/src/app/page.tsx` : lignes de la liste cliquables, ouvrent `/fiche?id=...` — sert le critère 1 (navigation vers la fiche).
    - `e2e/demo.spec.ts` : étape « j'ouvre une demande et je la fais avancer jusqu'à Devis signé ».

---

## À venir (objectifs, à détailler au fil de l'eau)

4. **Créer la session** (screen-5) : bouton sur la fiche demande, visible une fois l'étape « Devis signé / Commande » atteinte (ou directement pour une collectivité, dont le devis est toujours « sans objet »), qui génère une session pré-remplie (organisme, module, antenne, payant/non, financeur, participants prévus) sans ressaisie, et fait passer la demande à l'étape « Session créée » (groupe `session_creee`, déjà prévu côté données). Pas de nouvel écran de confirmation : la fiche affiche l'état « session créée ». Fichiers prévus : `api/src/routes.ts` (règle de transition + éventuels champs de session), `frontend/src/app/fiche/page.tsx` (bouton conditionnel). Critères d'acceptation pressentis (à confirmer en DoR) : (1) le bouton n'apparaît que lorsque la demande est prête (devis signé, ou collectivité) ; (2) après création, la demande passe dans la section « Sessions créées » de la liste ; (3) les informations saisies à l'origine (organisme, module, participants) se retrouvent sans ressaisie.
5. **Suivi post-session** (screen-6) : case à cocher « Facture envoyée » sur la fiche d'une demande entreprise, après la formation.
6. **Vue Pipeline — direction** (screen-7) : vue en colonnes (une par étape), une carte par demande (organisme, type, module, responsable, ancienneté), filtre par antenne, alerte sur les demandes bloquées depuis plus de 14 jours, lecture seule.
7. **Stabilisation finale** : quand le temps restant ne permet plus qu'une itération, elle sert à stabiliser ce qui sera montré au pitch (corriger les régressions visibles, vérifier `/health` et `/sante`, rejouer `e2e/demo.spec.ts`), plutôt qu'à ajouter du périmètre.
