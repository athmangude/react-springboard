<div align="center">
  <img src="https://github.com/athmangude/spring-board/blob/development/src/assets/icons/icon-512x512.png?raw=true" alt="Spring Board" align="center" height="300px" width="300px" />
</div>

<br />

# Product UI

The Product UI is the client facing product for all products including, VOC, Customers & Analytics and Audience.

---

## Requirements

For development, you will only need Node Version Manager (NVM), Node.js and Yarn, installed in your environement.

## Mac OS / Linux / Unix

### Install NVM for managing Node.js versions

The reason for using [nvm](https://github.com/creationix/nvm) instead of other install types is mainly in how easy it is to have multiple versions of Node.js (if needed) without too much of extra complexity. Sometimes applications might require a certain version of Node.js to work, so having the flexibility of using specific versions can save a lot of time from you.

1. Open new Terminal window.
2. Run [nvm](https://github.com/creationix/nvm) installer
   - ...with _either_ curl _or_ wget.
     - `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
     - `wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
   - The script clones the nvm repository to `~/.nvm` and adds the source line to your profile (`~/.bash_profile`, `~/.zshrc,` `~/.profile,` or `~/.bashrc`). (You might want/need to add the source loading line by yourself, if the automated install tool does not add it for you.)
     ```sh
     export NVM_DIR="$HOME/.nvm"
     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
     [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
     ```
3. If everything went well, you should now be able to reload the shell by running
   - `source ~/.bashrc`
   - (Another option is to open a new Terminal window/tab.)
4. Verify installation
   - To verify that nvm has been installed, do: `command -v nvm`
5. List what versions of Node are currently installed (probably none).
   - `nvm ls`
6. Install latest [Node.js](https://nodejs.org/en/) LTS release (recommended for production usage).
   - `nvm install lts`
   - `nvm install v11.10.0`

### Yarn installation

After installing NVM, this project will need yarn too, so just run the following command.

- `npm install -g yarn`

---

## Windows

### Install NVM for managing Node.js versions

The reason for using [nvm](https://github.com/coreybutler/nvm-windows) instead of other install types is mainly in how easy it is to have multiple versions of Node.js (if needed) without too much of extra complexity. Sometimes applications might require a certain version of Node.js to work, so having the flexibility of using specific versions can save a lot of time from you.

1. Download and install nvm-setup.zip for the stable maintenance release from [here](https://github.com/coreybutler/nvm-windows/releases)
2. To install Node.js and NPM, open CMD prompt and run
   - `nvm install latest`
3. If everything went well, check the Node.js version installed by running
   - `node -v`
   - (Another option is to open a new Terminal window/tab.)
4. Use the installed Node.js version that is outputted from the previous command e.g. v11.12.0
   - `nvm use 11.12.0`
5. Install [node-gyp](https://github.com/nodejs/node-gyp), a command-line tool written in Node.js for compiling native addon modules for Node.js
   - `npm install -g node-gyp`
6. Install the build tools for compiling native Node.js modules in windows by running
   - `npm install —global —production windows-build-tools`

### Yarn installation

Download and install yarn [here](https://yarnpkg.com/en/docs/install#windows-stable).

### Git installation

Download and install git from [here](https://git-scm.com/download/win).

---

## Install

Next up, installing the application

- `git clone git@github.com:athmangude/spring-board.git`
- `cd new-ui`
- `yarn run init`

## Running the project

You can run the application by executing the command:

- `yarn run dev`

## Build

1. To build for development.

- `yarn run build-development`

2. To build for staging/QA.

- `yarn run build-stage`

3. To build in production/beta.

- `yarn run build`

## Publish

There are different publish scripts to deploy to different environments

1. To deploy build to development.

- `yarn run publish-development`

2. To deploy build to staging/QA.

- `yarn run publish-stage`

2. To deploy build to production.

- `yarn run publish`

3. To deploy build to beta.

- `yarn run publish-beta`

---

## Building and Deploying On-premise

To run on any environment, the application needs a `BRIDGE_URL`; a URL pointing to wherever bridge is setup. This is setup in a configuration file located at `/src/config/index.js`. The file contains configurations for different environments all in one place. The application will know which environment property to use based on the value of the `NODE_ENV` variable set at the build script.

Here is an example of the `production` property on the object that will be used when the staging script; `yarn run build-stage` is run. This goes on to execute the commands `rm -rf dist && NODE_ENV=staging webpack --config webpack.config.production.js --color -p --progress --hide-modules --display-optimization-bailout`.

```
production: {
    api: {
      url: 'https://bridge-location.springboard.com/api/0.1.0', // Brige API url root
    },
    socket: {
      url: 'https://bridge-location.springboard.com', // websocket connection for realtime updates
    },
    metrics: {
      url: 'https://metrics-server-location.compnay.com', // endpoint for metrics server
    }
  },
```

To build for on-premise deployment

1. Update the URLs on the production property on the config object to reflect the urls you want to point to. You should know this in advance.
2. Run the script `yarn run build`. This products assets in a `/dist` folder.
3. Take the produced `/dist` folder and put them on your static file server

---

## Common issues

#### 1. jpegran issue on images

> ```
> ERROR in ./app/images/login_bg.jpg
> Module build failed: Error: spawn /Users/athmangude/Workspace/OpenSource/react-springboard/node_modules/jpegtran-bin/vendor/jpegtran > ENOENT
>     at Process.ChildProcess._handle.onexit (internal/child_process.js:229:19)
>     at onErrorNT (internal/child_process.js:406:16)
>     at process._tickCallback (internal/process/next_tick.js:63:19)
>  @ ./app/containers/WifiAuthentication/index.js 26:0-51
>  @ ./app/containers/App/index.js
>  @ ./app/app.js
>  @ multi eventsource-polyfill webpack-hot-middleware/client?reload=true ./app/app.js
> ```

```
`npm rebuild jpegtran-bin`
```
