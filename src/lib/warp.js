const { WarpFactory, LoggerFactory } = window.warp

LoggerFactory.INST.logLevel('error')
const warp = WarpFactory.forMainnet()

export const readState = async (contract) => {
  await warp.contract(contract).syncState('https://dre-1.warp.cc/contract', { validity: true })
  return warp.contract(contract).setEvaluationOptions({
    allowBigInt: true,
    internalWrites: true
  }).readState().then(res => res.cachedValue.state)
}

export const writeTx = async (contract, input, internal) => {
  await warp.contract(contract).syncState('https://dre-1.warp.cc/contract', { validity: true })
  return warp.contract(contract).connect('use_wallet').setEvaluationOptions({
    allowBigInt: true,
    internalWrites: true
  }).writeInteraction(input, { strict: true })
}

export const dryRun = async (contract, input) => {
  await warp.contract(contract).syncState('https://dre-1.warp.cc/contract', { validity: true })
  return warp.contract(contract).connect('use_wallet')
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true
    })
    .dryWrite(input)
}

export const balances = (walletAddress) => fetch(`https://contracts.warp.cc/balances?walletAddress=${walletAddress}`).then(res => res.json())