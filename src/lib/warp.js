const { WarpFactory, LoggerFactory } = window.warp
const arweave = window.Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet()
const CACHE = 'https://cache.permapages.app'
const REDSTONE_GATEWAY = 'https://gateway.redstone.finance'

export const readState = (contract) => {
  return fetch(`${CACHE}/${contract}`).then(res => res.json())
}

export const writeTx = async (contract, input, internal) => {
  const tx = await createTransaction(arweave, contract, input, internal !== "" ? internal : null)
  await arweave.transactions.sign(tx)
  await writeInteraction(tx)
  return fetch(`${CACHE}/${contract}`).then(res => res.json())
}


// warp.contract(contract).connect('use_wallet')
//   .setEvaluationOptions({
//     internalWrites: true,
//     allowUnsafeClient: true,
//     allowBigInt: true
//   })
//   .writeInteraction(input)

export const dryRun = (contract, input) => warp.contract(contract).connect('use_wallet')
  .setEvaluationOptions({
    internalWrites: true,
    allowUnsafeClient: true,
    allowBigInt: true
  })
  .dryWrite(input)



async function createTransaction(arweave, contract, input, interact = null) {
  const tx = await arweave.createTransaction({
    data: Math.random().toString().slice(-4),
    reward: '72600854',
    last_tx: 'p7vc1iSP6bvH_fCeUFa9LqoV5qiyW-jdEKouAT0XMoSwrNraB9mgpi29Q10waEpO'
  })

  if (interact) {
    tx.addTag('Interact-Write', interact)
  }
  tx.addTag('App-Name', 'SmartWeaveAction')
  tx.addTag('App-Version', '0.3.0')
  tx.addTag('Contract', contract)
  tx.addTag('Input', JSON.stringify(input))
  tx.addTag('SDK', 'Warp')

  return tx
}

function writeInteraction(tx) {
  return fetch(`${REDSTONE_GATEWAY}/gateway/sequencer/register`, {
    method: 'POST',
    body: JSON.stringify(tx),
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }).then(res => res.ok ? res.json() : Promise.reject(res))
}