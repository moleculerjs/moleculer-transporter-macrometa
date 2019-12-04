![Moleculer logo](http://moleculer.services/images/banner.png)

# moleculer-transporter-macrometa [![NPM version](https://img.shields.io/npm/v/moleculer-transporter-macrometa.svg)](https://www.npmjs.com/package/moleculer-transporter-macrometa)

[Proof-of-Concept] MacroMeta stream transporter for Moleculer microservices framework

# Features

# Install

```bash
$ npm install moleculer-transporter-macrometa --save
```

# Usage
```js
// moleculer.config.js
const MacroMetaTransporter = require("moleculer-transporter-macrometa");

module.exports = {
    logger: true,

    transporter: new MacroMetaTransporter({
        config: "https://gdn1.macrometa.io",

        auth: {
            email: process.env.FABRIC_EMAIL,
            password: process.env.FABRIC_PASS
        },

        localStreams: true
    })
};
```

# Settings


# Test
```
$ npm test
```

In development with watching

```
$ npm run ci
```

# License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).

# Contact
Copyright (c) 2016-2019 MoleculerJS

[![@moleculerjs](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
