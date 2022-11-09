<script>
  import Modal from "../components/modal.svelte";
  import { hx, profile } from "../store.js";
  import { take, takeLast, mergeRight, pick, omit } from "ramda";
  import { readState, writeTx, dryRun } from "../lib/warp.js";
  import Connect from "../dialogs/connect.svelte";
  import WalletHelp from "../dialogs/wallet-help.svelte";

  export let contractID = "";
  let processDialog = false;
  let data = JSON.stringify({});
  let input = {};
  let inputs = "";
  let showConnect = false;
  let showHelp = false;
  let inputData = [];
  let internal = "";

  async function write() {
    processDialog = true;

    input = mergeRight(
      input,
      inputData.reduce((a, v) => {
        console.log(v.type);
        let value = v.value;
        if (v.type === "number") {
          value = Number(v.value);
        } else if (v.type === "array") {
          value = JSON.parse(v.value);
        }
        return { ...a, [v.key]: value };
      }, {})
    );
    try {
      const result = await writeTx(contractID, input, internal)
        .then((res) => omit(["bundlrResponse"], res))
        .catch((e) => {
          return pick(["state", "result", "message"], e);
        });
      // if (result.ok) {
      //   data = JSON.stringify(await readState(contractID), null, 2);
      // } else {
      //   data = JSON.stringify(result, null, 2);
      // }
      data = JSON.stringify(result, null, 2);
      //setTimeout(hljs.highlightAll, 100);
      processDialog = false;
    } catch (e) {
      processDialog = false;
      alert(e.message);
    }
  }

  async function dry() {
    processDialog = true;
    input = mergeRight(
      input,
      inputData.reduce((a, v) => {
        console.log(v.type);
        let value = v.value;
        if (v.type === "number") {
          value = Number(v.value);
        } else if (v.type === "array") {
          value = JSON.parse(v.value);
        }
        return { ...a, [v.key]: value };
      }, {})
    );
    console.log(input);
    try {
      const result = await dryRun(contractID, input).catch((e) => {
        console.log(e);
        return e;
      });
      console.log(result);
      data = JSON.stringify(result, null, 2);
      //setTimeout(hljs.highlightAll, 100);
      processDialog = false;
    } catch (e) {
      processDialog = false;
      alert(e.message);
    }
  }

  function links() {
    return $hx.map(
      (v, i) =>
        `<a class="link badge badge-outline no-underline" href="/write/${v}">${take(
          4,
          v
        )}...${takeLast(4, v)}</a>`
    );
  }

  async function disconnect() {
    await window.arweaveWallet.disconnect();
    $profile = null;
  }
</script>

<nav
  class="flex space-x-4 h-[75px] bg-secondary text-secondary-content flex items-center"
>
  <div class="flex-1">
    <a class="btn btn-ghost" href="/">Warp Explorer</a>
  </div>
  <div class="flex-none">
    <a class="btn btn-ghost" href="/">Read</a>
    <a class="btn btn-ghost" href="/write">Write</a>
    {#if !$profile}
      <button class="btn btn-ghost" on:click={() => (showConnect = true)}
        >Connect</button
      >
    {:else}
      <button class="btn btn-ghost" on:click={disconnect}>Disconnect</button>
    {/if}
  </div>
</nav>
<main>
  <section class="hero min-h-screen bg-base-100 items-start">
    <div class="flex flex-col">
      <form
        class="form w-[800px] mt-8 space-y-4"
        on:submit|preventDefault={write}
      >
        <div class="form-control">
          <input
            type="text"
            class="input input-bordered"
            placeholder="CONTRACT_ID"
            bind:value={contractID}
          />
          <div class="flex space-x-2 items-center">
            <label class="label flex-none"> hx: </label>
            {@html links()}
          </div>
        </div>
        <div class="form-control">
          <input
            type="text"
            class="input input-bordered"
            placeholder="FUNCTION e.g. transfer, balance, mint, etc"
            bind:value={input.function}
          />
        </div>
        <div class="form-control">
          <input
            type="text"
            class="input input-bordered"
            placeholder="(optional) internal write contract"
            bind:value={internal}
          />
        </div>
        {#each inputData as item}
          <div class="flex space-x-16">
            <div class="form-control">
              <label class="label">Type</label>
              <select class="select select-bordered" bind:value={item.type}>
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="array">array</option>
              </select>
            </div>
            <div class="form-control">
              <label class="label">Key</label>
              <input class="input input-bordered" bind:value={item.key} />
            </div>
            <div class="form-control">
              <label class="label">Value</label>
              <input
                class="input input-bordered w-[600px]"
                bind:value={item.value}
              />
            </div>
          </div>
        {/each}
        <button
          type="button"
          class="btn"
          on:click={() =>
            (inputData = [
              ...inputData,
              { key: "", value: "", type: "string" },
            ])}>Add Input</button
        >
        <!--
        <div class="form-control">
          <textarea
            class="textarea textarea-bordered"
            placeholder="Inputs e.g {`{ "target": "...", "qty": 12 } `} "
            bind:value={inputs}
          />
          <label class="label">JSON</label>
        </div>
        -->
        <div class="">
          <button class="btn btn-primary">Write Interaction</button>
          <button type="button" on:click={dry} class="btn btn-secondary"
            >Dry Run</button
          >
        </div>
      </form>
      <div class="mt-16">
        <h3 class="text-xl mb-4">Output</h3>
        <div class="mockup-window border border-base-300">
          <div class="flex justify-start px-4 pborder-t border-base-300">
            <pre><code class="language-json">
{data}
            </code></pre>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
<Modal open={processDialog} ok={false}>
  <h3 class="text-xl">Running Interaction...</h3>
</Modal>
<Connect bind:open={showConnect} on:help={() => (showHelp = true)} />
<WalletHelp bind:open={showHelp} />
