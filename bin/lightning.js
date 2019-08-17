const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const lnService = require('ln-service')

const port = 8888

const macaroonPath =
  process.env.HOME + '/.lnd/data/chain/bitcoin/mainnet/admin.macaroon'
const tlsPath = process.env.HOME + '/.lnd/tls.cert'

const macaroon = fs.readFileSync(macaroonPath).toString('base64')
const tls = fs.readFileSync(tlsPath).toString('base64')

const { lnd } = lnService.authenticatedLndGrpc({
  cert: tls,
  macaroon: macaroon,
  socket: '127.0.0.1:10009'
})

// var balance = 2000
var amount = 999

function getBalance (user) {
  return ledger[user]
}

var ledger = require('./ledger.json')
var user = process.env.USER || 'https://melvincarvalho.com/#me'

var balance = getBalance(user)
console.log('ledger', ledger)

const app = express()
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.listen(port, function () {
  console.log(`Solidpay server listening on port http://localhost:${port}`)
  app.get('/channel', (req, res) => {
    lnService.getChannelBalance({ lnd }, (err, result) => {
      res.send('<pre>channel balance is \n' + result.channel_balance)
    })
  })

  app.get('/info', (req, res) => {
    // Callback syntax
    lnService.getWalletInfo({ lnd }, (err, result) => {
      res.send('<pre>public key is : \n' + result.public_key)
    })
  })

  app.get('/balance', (req, res) => {
    // Callback syntax
    res.send(`<pre>user : ${user}\nbalance : ${balance}`)
  })

  app.get('/index', (req, res) => {
    // Callback syntax
    var output = `Balance : <a href="/balance">Balance</a><br />`
    output += `Pay : <a href="/pay">Pay</a><br />`
    res.send(`${output}`)
  })

  app.get('/pay', (req, res) => {
    // Callback syntax
    const request = req.query.request
    console.log('request', request)
    if (!request) {
      res.send('add a payment request')
      return
    }
    lnService.decodePaymentRequest({ lnd, request: request }, (err, result) => {
      console.log('decoded', result)
      amount = result.tokens
      if (amount > ledger[user]) {
        console.log('not enough funds')
        res.send('not enough funds')
        return
      }
      ledger[user] -= amount
      console.log('ledger', ledger)
      // @@ not concurrent for now
      fs.writeFileSync('./ledger.json', JSON.stringify(ledger))
      lnService.payViaPaymentRequest(
        { lnd, request: request },
        (err, result) => {
          res.send(
            `<pre>request = ${request} \n\n${
              result ? result.toString() : ''
            }\n\n${err ? err.toString() : ''}`
          )
        }
      )
    })
  })
  app.post('/pay', (req, res) => {
    // Callback syntax
    // console.log('request', req.body)
    const request = req.body.request
    console.log('req.body', req.body)
    console.log('request', request)
    if (!request) {
      console.log('no request found')
      res.send('add a payment request')
      return
    }
    console.log('request', request)
    lnService.decodePaymentRequest({ lnd, request: request }, (err, result) => {
      console.log('decoded', result)
      amount = result.tokens
      if (amount > ledger[user]) {
        console.log('not enough funds')
        res.send('not enough funds')
        return
      }
      ledger[user] -= amount
      console.log('ledger', ledger)
      // @@ not concurrent for now
      fs.writeFileSync('./ledger.json', JSON.stringify(ledger))
      lnService.payViaPaymentRequest(
        { lnd, request: request },
        (err, result) => {
          res.send(
            `<pre>request = ${request} \n\n${
              result ? result.toString() : ''
            }\n\n${err ? err.toString() : ''}`
          )
        }
      )
    })
  })
})
