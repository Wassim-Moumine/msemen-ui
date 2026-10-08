# msemen-ui

Site vitrine statique sur le msemen marocain, servi par nginx, avec un Mattermost (PostgreSQL) et un monitoring qui envoie une alerte dans Mattermost si le site tombe.

## Architecture

| Service | Image | Port | Rôle |
|---|---|---|---|
| `msemen-ui` | build local (`nginx-unprivileged:1.27-alpine`) | 80 → 8080 | Site statique |
| `db` | `postgres:17-alpine` | aucun (réseau interne) | Base de Mattermost |
| `mattermost` | `mattermost/mattermost-team-edition:10.11` | 8065 | Messagerie d'équipe |
| `monitor` | `curlimages/curl` | aucun | Vérifie `/health` toutes les 30 s et alerte via webhook |

Réseaux :
- `front` : site, Mattermost, monitor
- `back` (interne, sans accès Internet) : PostgreSQL, Mattermost

## Prérequis

- Docker et Docker Compose v2
- Ports 80 et 8065 libres

## Installation

```bash
git clone https://github.com/Wassim-Moumine/msemen-ui.git
cd msemen-ui
```

Créer un fichier `.env` à la racine (non versionné) :

```env
POSTGRES_USER=mmuser
POSTGRES_PASSWORD=ChangeMoi_MotDePasseFort
POSTGRES_DB=mattermost
MM_SITEURL=http://mattermost.localhost:8065
MM_WEBHOOK_KEY=
```

## Démarrage

1. Lancer le site, la base et Mattermost :
   ```bash
   docker compose up -d --build msemen-ui db mattermost
   ```
2. Ouvrir http://mattermost.localhost:8065, créer le compte admin, une équipe et un canal `alertes`.
3. **Intégrations > Webhooks entrants > Ajouter**, choisir le canal `alertes`, copier la clé (après `/hooks/`) dans `MM_WEBHOOK_KEY` du `.env`.
4. Lancer le monitor :
   ```bash
   docker compose up -d monitor
   ```

## Accès

- Site : http://msemen.localhost
- Healthcheck : http://msemen.localhost/health
- Mattermost : http://mattermost.localhost:8065

## Tester l'alerte

```bash
docker compose stop msemen-ui    # alerte DOWN après ~90 s (3 échecs)
docker compose start msemen-ui   # message UP sous 30 s
```

## Sécurité

- Conteneur nginx non-root, système de fichiers en lecture seule (`read_only` + `tmpfs`)
- `cap_drop: ALL` et `no-new-privileges` sur le site et le monitor
- PostgreSQL isolé sur un réseau interne, aucun port exposé
- Secrets dans `.env`, exclu de Git

## Commandes utiles

```bash
docker compose ps                  # état des conteneurs
docker compose logs -f monitor     # logs du monitoring
docker compose down                # arrêter (données conservées)
docker compose down -v             # arrêter et supprimer les volumes
```

## Arborescence

```
.
├── site/                 # fichiers du site statique
├── monitor/check.sh      # script de surveillance
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .dockerignore
├── .gitattributes        # force LF sur les .sh
└── .gitignore
```
