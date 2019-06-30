var OFFSET = 128

/**
 * gets sha256 string from string
 *
 * @param {*} str
 * @returns sha256
 */
async function sha256 (str) {
  var bytes = new TextEncoder('utf-8').encode(str)
  const buf = await crypto.subtle.digest('SHA-256', bytes)
  return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('')
}

/**
 * hex to bytes
 *
 * @param {*} str
 * @returns bytes
 */
function hexToBytes (str) {
  var result = []
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16))
    str = str.substring(2, str.length)
  }
  return result
}

/**
 * get encoded point
 *
 * @param {*} pt
 * @param {*} compressed
 * @returns bytes
 */
function getEncoded (pt, compressed) {
  var x = pt.getX().toBigInteger()
  var y = pt.getY().toBigInteger()
  var enc = integerToBytes(x, 32)
  if (compressed) {
    if (y.isEven()) {
      enc.unshift(0x02)
    } else {
      enc.unshift(0x03)
    }
  } else {
    enc.unshift(0x04)
    enc = enc.concat(integerToBytes(y, 32))
  }
  return enc
}

/**
 * Get an EC Key from hash
 *
 * @param {string} hash
 * @returns ECKey
 */
function getECKeyFromHash(hash) {
  var eckey = new Bitcoin.ECKey(hexToBytes(hash))
  return eckey
}


/**
 * get a private key address form hash
 *
 * @param {string} hash
 * @param {string} Compressed
 */
function getPrivateKeyAddressFromHash(hash, addressType, publicKeyVersion) {
  const OFFSET = 128
  var payload = hexToBytes(hash)
  if (addressType === 'compressed') {
    payload.push(0x01)
  }
  var sec = new Bitcoin.Address(payload)
  sec.version = parseInt(publicKeyVersion) + OFFSET
  return sec
}

/**
 * get public key from private
 *
 * @param {*} eckey
 * @param {*} addressType
 * @param {*} publicKeyVersion
 * @returns
 */
function getPublicKeyFromPrivate(eckey, addressType, publicKeyVersion) {
  var curve = getSECCurveByName('secp256k1')
  var genEckey = {}
  var genPt = curve.getG().multiply(eckey.priv)
  if (addressType === 'uncompressed') {
    genEckey.pub = getEncoded(genPt, false)
  } else {
    genEckey.pub = getEncoded(genPt, true)
  }

  // get pub key hash
  genEckey.ripe160 = Bitcoin.Util.sha256ripe160(genEckey.pub)

  // get pub key address
  var address = new Bitcoin.Address(genEckey.ripe160)
  address.version = parseInt(publicKeyVersion)
  genEckey.address = address
  return genEckey
}

/**
 * Main body of brain app
 *
 * @class Body
 * @extends {React.Component}
 */
class Body extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pw: '',
      sha256: '',
      publicKeyVersion: 0,
      addressType: 'uncompressed',
      timeTaken: 0,
      eckey: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
  }

  async handleChange (e) {
    let startTime = new Date().getTime()
    var pw
    var target = e.target
    if (e.target) {
      var name = e.target.name
    }

    if (name === 'pw') {
      pw = event.target.value
      this.setState({pw: pw })
    } else if (name === 'publicKeyVersion') {
      pw = this.state.pw
      this.setState({publicKeyVersion: event.target.value })
    } else if (name === 'addressType') {
      pw = this.state.pw
      this.setState({addressType: event.target.value })
    }

    var that = this
    await sha256(pw).then((sha256) => {

      // get privkey from hash
      var privateKey = getECKeyFromHash(sha256)

      // get privateKey address
      var privateAddress = getPrivateKeyAddressFromHash(sha256, 
        this.state.addressType, this.state.publicKeyVersion)

      // get pub key from private
      var publicKey = getPublicKeyFromPrivate(privateKey, this.state.addressType,
        this.state.publicKeyVersion)

      // benchmark
      var timeTaken = new Date().getTime() - startTime

      // update state
      that.setState({
        sha256: sha256,

        eckeyPriv: privateKey.priv,
        privateAddress: privateAddress,

        eckeyPub: publicKey.pub,
        ripe160: publicKey.ripe160,
        address: publicKey.address,
        
        timeTaken: timeTaken
      })
    })
  }

  render () {
    return <section className='section'>
      <form onSubmit={this.handleSubmit}>
        <div className='columns'>
          <div className='column'>
            <select name='addressType' onChange={this.handleChange} value={this.state.addressType}>
              <option selected value='uncompressed'>Uncompressed</option>
              <option value='compressed'>Compressed</option>
            </select>
            <select name='publicKeyVersion' onChange={this.handleChange} value={this.state.publicKeyVersion}>
              <option selected value='0'>Bitcoin</option>
              <option value='85'>Bitmark</option>
              <option value='111'>Testnet3</option>
            </select>

            <hr />
            Passphrase
          <br />
            <input name='pw' size='60' type='text' placeholder='Enter passphrase'
              value={this.state.pw}
              onChange={this.handleChange} autoFocus />
            <br />

            <hr />

          Secret Exponent (sha256)
          <br />
            <input readOnly size='60' placeholder='Secret Exponent (sha256)'
              value={this.state.sha256} />
            <br />

          Secret Exponent (sha256) as Bytes
          <br />
            <input readOnly size='60' placeholder='Secret Exponent (sha256) as Bytes'
              value={hexToBytes(this.state.sha256)} />

            <br />

          ECDSA Private Key (BigInteger)
          <br />
            <input readOnly size='60' placeholder='ECDSA Private Key (BigInteger)'
              value={this.state.eckeyPriv} />
            <br />

          Private Key Base58 check Address
          <br />
            <input readOnly size='60' placeholder='Private Key Base58 check Address'
              value={this.state.privateAddress} />
            <hr />

          ECDSA Public Key as Bytes
          <br />
            <input readOnly size='60' placeholder='ECDSA Public Key as Bytes'
              value={this.state.eckeyPub} />
            <br />

          Ripe 160 hash of Public Key as Bytes
          <br />
            <input readOnly size='60' placeholder='Ripe 160 hash of Public Key as Bytes'
              value={this.state.ripe160} />
            <br />

          Public Key Base58 check Address
          <br />
            <input readOnly size='60' placeholder='Public Key Base58 check Address'
              value={this.state.address} />
            <br />
            <hr />
          Computed in : {this.state.timeTaken} ms

          </div>
        </div>
      </form>
    </section>
  }

}
