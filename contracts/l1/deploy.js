import { DeployPlugin } from 'warp-contracts-plugin-deploy'
import { SourceType, WarpFactory, defaultCacheOptions } from 'warp-contracts'
import fs from 'fs'

const warp = WarpFactory.forMainnet(defaultCacheOptions, true).use(new DeployPlugin())
const src = fs.readFileSync('./contracts/l1/contract.js', 'utf-8')
const initState = fs.readFileSync('./contracts/l1/state.json', 'utf-8')
const jwk = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

async function main() {
  const result = await warp.deploy({
    src,
    initState,
    wallet: jwk,
    evaluationManifest: {
      evaluationOptions: {
        sourceType: SourceType.ARWEAVE,
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip'
      }
    },
    disableBundling: true
  })
  console.log(result)
}

main()