# Buyin Tracker BE

## Uses
This is the API for the project. It uses express, dotenv, MongoDB.

### Setup
You'll need to do a little setup to get up and running on the project. This will include installing the packages, connecting to the DB, and syncing our secrets from the dotenv vault.


### Getting Started


#### Accessing the dotenv vault 
You'll need an account to access the secrets vault. The admin of the project should be able to add you to the project and allow access to the secrets. If you're blocked by this step, just add a `.env` file to the route of your project with the secrets you need.

You should run the following. You might be asked to install the dotenv-vault package, just enter `y` and it will install.

`npx dotenv-vault@latest login`

`npx dotenv-vault@latest open`

This should give you the ability to view the project if you've created your account and have correct access rights. This will take some learning, and you can read more at the [docs](https://www.dotenv.org/docs/quickstart/sync#log-in-env-vault).

Once you are logged in an open the vault, you may use

```
$ npx dotenv-vault@latest push
$ npx dotenv-vault@latest pull
```

to push and pull your ENV files (as you would in github) to the dotenv vault. The prod and CLI vaults can be managed in the UI with a different ENV dropdown or thru altering the .env.cli and .env.production files and pushing them with:

```
$ npx dotenv-vault@latest push cli
$ npx dotenv-vault@latest pull cli

$ npx dotenv-vault@latest push production
$ npx dotenv-vault@latest pull production
```

Sync your changes (push/pull) whenever you make changes to those ENV files so we can all share the same ENV vars.

#### Install node packages
`cd` to the project root and `npm install`

#### Running the project
`npm run start:dev`

This will start the server on `http://localhost:3001` and listen for any changes made to the ts files. When changes are made, it will auto reload to show them.

If changes are made to the package.json or any dependencies, you'll have to kill the server, `npm install` and run the `npm run start:dev` again