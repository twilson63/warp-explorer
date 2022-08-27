import { Async } from 'crocks'

//const { of, ask lift } = ReaderT(Async)
const { of, fromPromise } = Async

const arweave = window.Arweave.init({ host: 'arweave.net', port: 443, protocol: 'https' })
const warp = window.warp.WarpWebFactory.memCached(arweave)
const initWarp = contract => warp.contract(contract).connect('use_wallet').setEvaluationOptions({ internalWrites: true })

export const readState = (contract) => of(contract)
  .map(initWarp)
  .chain(w => fromPromise(w.readState.bind(w))())
  .toPromise()

export const writeInteraction = (contract, input) => of(contract)
  .map(initWarp)
  .map(w => fromPromise(w.bundleInteraction.bind(w)))
  .chain(fn => fn(input))
  .toPromise()

export const dryRun = (contract, input) => of(contract)
  .map(initWarp)
  .map(w => fromPromise(w.dryWrite.bind(w)))
  .chain(fn => fn(input))
  .toPromise()
