import { Async } from 'crocks'
import { assoc } from 'ramda'
//const { of, ask lift } = ReaderT(Async)
const { of, fromPromise } = Async

const arweave = window.Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })
const warp = window.warp.WarpWebFactory.memCached(arweave)
const initWarp = contract => warp.contract(contract).connect('use_wallet')
  .setEvaluationOptions({ internalWrites: true, allowUnsafeClient: true, allowBigInt: true })
const CACHE = 'https://cache.permapages.app'
const REDSTONE_GATEWAY = 'https://gateway.redstone.finance'
const INTERACTION_PATH = 'gateway/sequencer/register'

export const readState = (contract) => of(contract)
  .bichain(
    contract => initWarp(contract).chain(w => fromPromise(w.readState.bind(w))()),
    fromPromise(contract => fetch(`${CACHE}/${contract}`).then(res => res.ok ? res.json() : Promise.reject(res)))
  )
  // .map(initWarp)
  // .chain(w => fromPromise(w.readState.bind(w))())
  .toPromise()

export const writeInteraction = (contract, input) => of(contract)
  // .map(initWarp)
  // .map(w => fromPromise(w.bundleInteraction.bind(w)))
  // .chain(fn => fn(input))
  .chain(fromPromise(async contract => {
    const tx = await arweave.createTransaction({
      data: Math.random().toString().slice(-4),
      reward: '72600854',
      last_tx: 'p7vc1iSP6bvH_fCeUFa9LqoV5qiyW-jdEKouAT0XMoSwrNraB9mgpi29Q10waEpO'
    })

    tx.addTag('App-Name', 'SmartWeaveAction')
    tx.addTag('App-Version', '0.3.0')
    tx.addTag('Contract', contract)
    tx.addTag('Input', JSON.stringify(input))
    tx.addTag('SDK', 'Warp')

    await arweave.transactions.sign(tx)

    return await fetch(`${REDSTONE_GATEWAY}/${INTERACTION_PATH}`, {
      method: 'POST',
      headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(tx)
    }).then(res => res.ok ? res.json() : Promise.reject(res))
      .then(assoc('ok', true))

  }))
  .toPromise()

export const dryRun = (contract, input) => of(contract)
  .map(initWarp)
  .map(w => fromPromise(w.dryWrite.bind(w)))
  .chain(fn => fn(input))
  .toPromise()
