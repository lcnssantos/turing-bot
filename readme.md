<p align="right">
<img src="https://i.pinimg.com/originals/52/d5/87/52d587885d58c9c8c5bdfb1bda59fbc3.png" width="150"> <img align="left" src="https://logodownload.org/wp-content/uploads/2017/11/telegram-logo-1.png" width="100">
</p>

<br>

## About

This repository contains a telegram bot developed at an university extension project of USJT - Universidade São Judas Tadeu - São Paulo - Brazil.

This bot is created with goal to answer generic questions about computer programming.


## Requirements

Since that all components of this project is containerized, the only tools you will need is just docker and docker-compose.


## Installation

You can get the source code using the following options:

1. Download it to .zip file or
2. Use `git clone` command to clone this repository (remember to get `main` branch);

After that, follow the procedure below to put your application working.

1. Run command `cp example.env .env`
2. Open `.env` file with your favorite text editor tool and set the variables as follow:
    - `TELEGRAM_BOT_TOKEN`: This is your bot token, provided by the bot father
    - `PORT`: This is the port where the bot will run, for local environment using provided `docker-compose.yml`, use `8080` - note that this port will be forwarded by `docker` automatically to `3000`.
    - `MONGO_URL`: This is the MongoDb connection string that will store the cache response from `IBM -  Natural Language Understanding`, for local environment using provided `docker-compose`, use the value: `mongodb://turing:turing@mongo:27017/admin`
    - `IBM_API_KEY` and `IBM_API_URL` - these variables are the IBM cloud credentials.
    - `ENV` - The environment where application is running, `DEV` or `PROD`
    - `URL` - The actual url of application in order to setup the telegram webhooks. Only necessary for `PROD` environments.
3. Run command `docker-compose-up -d ` to put your containers to working.


## Using

1. Once that your containers is working well, you can just start a conversation with your bot and ask a lot of questions about programming

## Technologies used

1. `NodeJs` as javascript runtime;
2. `Typescript` as primary programming language;
3. `Docker` and `Docker Compose` for containers;
4. `NestJs` as backend framework to handle http webhooks requests as well as dependency injection;
5. `IBM Natural Language Understanding` to analyze the links and extract metadata.
6. `MongoDb` to cache responses from `IBM Natural Language Understanding`
7. `Telegraf` as wrapper to `Telegram Bot API`
