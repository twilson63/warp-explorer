import { WarpFactory, LoggerFactory } from 'warp-contracts';

LoggerFactory.INST.logLevel("error");
const warp = WarpFactory.forMainnet();
const options = {
  remoteStateSyncEnabled: true,
  allowBigInt: true,
  internalWrites: true,
  unsafeClient: "skip",
};
// sync BAR to make contract evaluations fast
// warp
//   .contract("VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA")
//   .syncState("https://cache-2.permaweb.tools/contract", { validity: true })
//   .then((c) => c.setEvaluationOptions(options).readState());

// warp
//   .contract("61vg8n54MGSC9ZHfSVAtQp4WjNb20TaThu6bkQ86pPI")
//   .syncState("https://cache-2.permaweb.tools/contract", { validity: true })
//   .then((c) => c.setEvaluationOptions(options).readState());

export const readState = async (contract) => {
  return warp
    .contract(contract)
    .setEvaluationOptions(options)
    .readState()
    .then((res) => res.cachedValue.state);
};

export const writeTx = async (contract, input) => {
  return warp
    .contract(contract)
    .connect("use_wallet")
    .setEvaluationOptions(options)
    .writeInteraction(input, { strict: true });
};

export const dryRun = async (contract, input) => {
  return warp
    .contract(contract)
    .connect("use_wallet")
    .setEvaluationOptions(options)
    .dryWrite(input);
};

export const balances = (walletAddress) =>
  fetch(
    `https://contracts.warp.cc/balances?walletAddress=${walletAddress}`
  ).then((res) => res.json());
