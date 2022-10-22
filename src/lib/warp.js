const { WarpFactory, LoggerFactory } = window.warp

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet()

export const readState = (contract) => {
  console.log({ contract })
  return warp.contract(contract).setEvaluationOptions({
    internalWrites: true,
    allowUnsafeClient: true,
    allowBigInt: true
  }).readState().then(({ cachedValue }) => cachedValue)
}

export const writeInteraction = (contract, input) => warp.contract(contract).connect('use_wallet')
  .setEvaluationOptions({
    internalWrites: true,
    allowUnsafeClient: true,
    allowBigInt: true
  })
  .writeInteraction(input)

export const dryRun = (contract, input) => warp.contract(contract).connect('use_wallet')
  .setEvaluationOptions({
    internalWrites: true,
    allowUnsafeClient: true,
    allowBigInt: true
  })
  .dryWrite(input)
