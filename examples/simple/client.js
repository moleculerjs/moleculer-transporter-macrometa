"use strict";

const { ServiceBroker } 	= require("moleculer");
const MacroMetaTransporter  = require("../../");

const _ = require("lodash");
const kleur = require("kleur");

// Create broker
const broker = new ServiceBroker({
	nodeID: process.argv[2] || "client-" + process.pid,
	transporter: new MacroMetaTransporter({
		config: "https://gdn1.macrometa.io",

		auth: {
			email: process.env.FABRIC_EMAIL,
			password: process.env.FABRIC_PASS
		},

		localStreams: true
	}),

	metrics: {
		enabled: true,

		reporter: [
			{
				type: "Console",
				options: {
					interval: 5,
					colors: true,
					onlyChanges: true,
					includes: ["moleculer.request.time"]
				}
			}
		]
	}
});

let reqCount = 0;
let pendingReqs = [];

broker.start()
	.then(() => broker.repl())
	.then(() => broker.waitForServices("math"))
	.then(() => {
		setInterval(() => {
			/* Overload protection
			if (broker.transit.pendingRequests.size > 10) {
				broker.logger.warn(kleur.yellow().bold(`Queue is big (${broker.transit.pendingRequests.size})! Waiting...`));
				return;
			}*/

			let pendingInfo = "";
			if (pendingReqs.length > 10) {
				pendingInfo = ` [${pendingReqs.slice(0, 10).join(",")}] + ${pendingReqs.length - 10}`;
			} else if (pendingReqs.length > 0) {
				pendingInfo = ` [${pendingReqs.join(",")}]`;
			}

			const payload = { a: _.random(0, 10), b: _.random(0, 10)};
			const count = ++reqCount;
			pendingReqs.push(count);
			let p = broker.call("math.add", payload, { meta: { count }});
			if (p.ctx) {
				broker.logger.info(kleur.grey(`${count}. Send request (${payload.a} + ${payload.b}) to ${p.ctx.nodeID ? p.ctx.nodeID : "some node"} (queue: ${broker.transit.pendingRequests.size})...`), kleur.yellow().bold(pendingInfo));
			}
			p.then(r => {
				broker.logger.info(_.padEnd(`${count}. ${payload.a} + ${payload.b} = ${r.res}`, 20), `(from: ${p.ctx.nodeID})`);

				// Remove from pending
				if (pendingReqs.indexOf(count) !== -1)
					pendingReqs = pendingReqs.filter(n => n != count);
				else
					broker.logger.warn(kleur.red().bold("Invalid coming request count: ", count));
			}).catch(err => {
				broker.logger.warn(kleur.red().bold(_.padEnd(`${count}. ${payload.a} + ${payload.b} = ERROR! ${err.message}`)));
				if (pendingReqs.indexOf(count) !== -1)
					pendingReqs = pendingReqs.filter(n => n != count);
			});
		}, 1000);

	});
