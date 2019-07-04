const lnService = require('ln-service');

const {lnd} = lnService.authenticatedLndGrpc({
  cert: 'base64 encoded tls.cert',
  macaroon: 'base64 encoded admin.macaroon',
  socket: '127.0.0.1:10009',
});

// Callback syntax
lnService.getWalletInfo({lnd}, (err, result) => {
  console.log(result.public_key);
});

// Promise syntax
console.log((await lnService.getWalletInfo({lnd})).public_key);