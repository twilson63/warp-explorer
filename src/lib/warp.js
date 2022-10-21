const { WarpFactory, LoggerFactory } = window.warp

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet()

export const readState = (contract) => warp.contract(contract).setEvaluationOptions({
  internalWrites: true,
  allowBigInt: true
}).readState().then(({ cachedValue }) => cachedValue)

export const writeInteraction = (contract, input) => warp.contract(contract).connect('use_wallet')
  .setEvaluationOptions({
    internalWrites: true,
    allowBigInt: true
  })
  .writeInteraction(input)

export const dryRun = (contract, input) => warp.contract(contract).connect('use_wallet')
  .setEvaluationOptions({
    internalWrites: true,
    allowBigInt: true
  })
  .dryWrite(input)
