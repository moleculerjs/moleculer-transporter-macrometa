"use strict";

const { ServiceBroker } 	= require("moleculer");
const MacroMetaTransporter  = require("../../");

const _ = require("lodash");

// Create broker
const broker = new ServiceBroker({
	nodeID: process.argv[2] || "server-" + process.pid,
	transporter: new MacroMetaTransporter({
		config: process.env.FABRIC_URL || "https://gdn1.macrometa.io",

		auth: {
			email: process.env.FABRIC_EMAIL,
			password: process.env.FABRIC_PASS
		},

		localStreams: false
	})
});

broker.createService({
	name: "math",

	actions: {
		add: {
			//fallback: (ctx, err) => ({ count: ctx.params.count, res: 999, fake: true }),
			//fallback: "fakeResult",
			handler(ctx) {
				//const wait = _.random(500, 1500);
				this.logger.info(_.padEnd(`${ctx.meta.count}. Add ${ctx.params.a} + ${ctx.params.b}`, 20), `(from: ${ctx.nodeID})`);
				//if (_.random(100) > 80)
				//	return this.Promise.reject(new MoleculerRetryableError("Random error!", 510, "RANDOM_ERROR"));

				return this.Promise.resolve()./*delay(wait).*/then(() => ({
					res: Number(ctx.params.a) + Number(ctx.params.b)
				}));
			}
		},
	}
});

// Start server
broker.start().then(() => {

	broker.repl();
});
