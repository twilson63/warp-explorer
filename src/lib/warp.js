const { WarpFactory, LoggerFactory } = window.warp;

LoggerFactory.INST.logLevel("error");
const warp = WarpFactory.forMainnet();
const options = {
  allowBigInt: true,
  internalWrites: true,
  unsafeClient: "allow",
}
// sync BAR to make contract evaluations fast
warp
  .contract("VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA")
  .syncState("https://cache-2.permaweb.tools/contract", { validity: true })
  .then(c => c.setEvaluationOptions(options).readState());

warp
  .contract("61vg8n54MGSC9ZHfSVAtQp4WjNb20TaThu6bkQ86pPI")
  .syncState("https://cache-2.permaweb.tools/contract", { validity: true })
  .then(c => c.setEvaluationOptions(options).readState());

export const readState = async (contract) => {
  await warp
    .contract(contract)
    .syncState("https://cache-2.permaweb.tools/contract", { validity: true });
  return warp
    .contract(contract)
    .setEvaluationOptions({
      allowBigInt: true,
      internalWrites: true,
      unsafeClient: "allow",
    })
    .readState()
    .then((res) => res.cachedValue.state);
};

export const writeTx = async (contract, input) => {
  await warp
    .contract(contract)
    .syncState("https://cache-2.permaweb.tools/contract", { validity: true });
  return warp
    .contract(contract)
    .connect("use_wallet")
    .setEvaluationOptions({
      allowBigInt: true,
      internalWrites: true,
      unsafeClient: "allow",
    })
    .writeInteraction(input, { strict: true });
};

export const dryRun = async (contract, input) => {
  await warp
    .contract(contract)
    .syncState("https://cache-2.permaweb.tools/contract", { validity: true });
  return warp
    .contract(contract)
    .connect("use_wallet")
    .setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: "allow",
    })
    .dryWrite(input);
};

export const balances = (walletAddress) =>
  fetch(
    `https://contracts.warp.cc/balances?walletAddress=${walletAddress}`
  ).then((res) => res.json());
