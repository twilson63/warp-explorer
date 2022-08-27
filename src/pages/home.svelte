<script>
  import { onMount } from "svelte";
  import { readState } from "../lib/warp.js";
  import { hx } from "../store.js";
  import { take, takeLast } from "ramda";
  import Modal from "../components/modal.svelte";

  export let contractID = "";

  let data = JSON.stringify({}, null, 2);
  let processDialog = false;

  //let hx = [];
  onMount(async () => {
    if (contractID.length > 0) {
      await read();
    }
  });
  async function read() {
    processDialog = true;
    if (!$hx.includes(contractID)) {
      $hx = [...$hx, contractID];
    }
    const result = await readState(contractID);
    data = JSON.stringify(result, null, 2);
    //setTimeout(hljs.highlightAll, 100);

    processDialog = false;
  }

  function links() {
    return $hx.map(
      (v, i) =>
        `<a class="link" href="/read/${v}">[${take(4, v)}...${takeLast(
          4,
          v
        )}]</a>`
    );
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
  </div>
</nav>
<main>
  <section class="hero min-h-screen bg-base-100 items-start">
    <div class="flex flex-col">
      <form class="form" on:submit|preventDefault={read}>
        <div class="form-control my-16 w-[800px]">
          <input
            type="text"
            class="input input-bordered"
            placeholder="CONTRACT_ID"
            bind:value={contractID}
          />
          <label class="label">
            hx: {@html links()}
          </label>
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
<Modal open={processDialog} ok={false}>
  <h3 class="text-xl">Reading Contract State...</h3>
</Modal>
