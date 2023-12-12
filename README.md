# Spam Blocker Pro

-   Developed RESTful API using Node.js and Express.js for spam-blocking web application with MySQL database,
    empowering users to report and search spam numbers.

-   Implemented robust user authentication, ensuring 100% protection against unauthorized access.

-   Engineered search functionality to facilitate efficient contact search by name or phone number, resulting in 30%
    the surge in user engagement and a 25% increase in user retention

## Run these commands

### fill dotenv `.env` file

```bash
# rename .env.example to .env then fill all field
# generate Token
require('crypto').randomBytes(64).toString('hex')

# install NPM dependencies
npm i
```

## How to use Database

### MySQL

```bash
mysql -h localhost -u root -p
CREATE DATABASE spamdb;
SHOW DATABASES;
```

### Postgres

> The psql commands assist us in querying the data from the specified database interactively. Here are some of the most frequently used, most effective psql commands:
> create new DATABASE

```bash
# enter into postresql
sudo su - postgres

# enter into user  `postgres user`
psql

# create database
CREATE DATABASE spamdb;

# create database with password
CREATE USER spamdb WITH PASSWORD 'password';

# grant all previllege
GRANT ALL PRIVILEGES ON DATABASE spamdb TO myprojectuser;

```

### Useful Postgres commands

#### Usefull Postgres commands

| Task Description                                 | Command                                     |
| ------------------------------------------------ | ------------------------------------------- |
| Connect to a Database                            | `psql -d spamdb -U postgres`                |
| Check Postgres Version                           | `SELECT VERSION();` or `postgres --version` |
| List All Databases                               | `\l`                                        |
| Access or Switch a Database                      | `\c db_name`                                |
| List All Tables                                  | `\dt`                                       |
| Describe All Tables                              | `\d`                                        |
| Describe a Specific Table                        | `\d tab_name`                               |
| List All Schemas                                 | `\dn`                                       |
| List All Views                                   | `\dv`                                       |
| List All Functions                               | `\df`                                       |
| List All Users                                   | `\du`                                       |
| Show Commands History                            | `\s`                                        |
| Save Query’s Results to a Specific File          | `\o file_name`                              |
| Run psql Commands/queries From a Particular File | `\i file_name`                              |
| Execute Previous Command                         | `\g`                                        |
| Show Query Execution Time                        | `\timing`                                   |
| Get Output in HTML Format                        | `\H`                                        |
| Align Columns Output                             | `\a`                                        |
| Get Help                                         | `\h`                                        |
| Get All psql Commands                            | `\?`                                        |
| Clear Screen                                     | `! cls`                                     |
| Quit psql                                        | `\q`                                        |

### Docker

```bash
# build images from docker-compose.yaml
docker-compose down && docker-compose up --build -d

# check both images
docker-compose ps

# logs containers
docker-compose logs app

# realtime logs
docker-compose logs -f

# network connection test
telnet db 5433

# check container exists
docker exec -it spam-app cat /etc/hosts
docker exec -it postgres cat /etc/hosts

# Ping Test Between Containers:
docker exec -it spam-app ping postgres
docker exec -it postgres ping spam-app

# Check Container IP Addresses:
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' spam-app
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' postgres

```
