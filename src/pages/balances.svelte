<script>
  import { balances } from "../lib/warp.js";
  import { profile } from "../store.js";
  import { take, takeLast } from "ramda";
  import Modal from "../components/modal.svelte";
  import Connect from "../dialogs/connect.svelte";
  import WalletHelp from "../dialogs/wallet-help.svelte";

  export let walletAddress = "";

  let data = JSON.stringify({}, null, 2);
  let processDialog = false;
  let showConnect = false;
  let showHelp = false;

  async function read() {
    processDialog = true;
    try {
      const result = await balances(walletAddress);
      data = JSON.stringify(result, null, 2);
      //setTimeout(hljs.highlightAll, 100);

      processDialog = false;
    } catch (e) {
      processDialog = false;
      alert(e.message);
    }
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
    <a class="btn btn-ghost" href="/balances">Balances</a>
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
      <form class="form" on:submit|preventDefault={read}>
        <div class="form-control my-16 w-[800px]">
          <div class="form-control">
            <div class="flex space-x-2">
              <input
                type="text"
                class="input input-bordered flex-1"
                placeholder="WALLET_ADDRESS"
                bind:value={walletAddress}
              />
              <button class="btn">Get Balances</button>
            </div>
          </div>
        </div>
      </form>
      <div class="">
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
<Modal bind:open={processDialog} ok={false}>
  <h3 class="text-xl">Balances...</h3>
</Modal>
<Connect bind:open={showConnect} on:help={() => (showHelp = true)} />
<WalletHelp bind:open={showHelp} />
