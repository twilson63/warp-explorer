<script>
  import Modal from "../components/modal.svelte";
  import { hx } from "../store.js";
  import { take, takeLast, mergeRight, pick, omit } from "ramda";
  import { writeInteraction, dryRun } from "../lib/warp.js";

  export let contractID = "";
  let processDialog = false;
  let data = JSON.stringify({});
  let input = {};
  let inputs = "";

  async function write() {
    processDialog = true;
    console.log(JSON.parse(inputs));
    input = mergeRight(input, JSON.parse(inputs));
    console.log(input);
    const result = await writeInteraction(contractID, input)
      //.then((res) => omit([], res))
      .catch((e) => {
        console.log(e);
        return pick(["state", "result", "message"], e);
      });
    data = JSON.stringify(result, null, 2);
    setTimeout(hljs.highlightAll, 100);
    processDialog = false;
  }

  async function dry() {
    processDialog = true;
    console.log(JSON.parse(inputs));
    input = mergeRight(input, JSON.parse(inputs));
    console.log(input);
    const result = await dryRun(contractID, input).catch((e) => {
      console.log(e);
      return e;
    });
    console.log(result);
    data = JSON.stringify(pick(["id", "originalTxId"], result), null, 2);
    setTimeout(hljs.highlightAll, 100);
    processDialog = false;
  }

  function links() {
    return $hx.map(
      (v, i) =>
        `<a class="link" href="/write/${v}">[${take(4, v)}...${takeLast(
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
          <label class="label flex">
            hx: {@html links()}
          </label>
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
          <textarea
            class="textarea textarea-bordered"
            placeholder="Inputs e.g {`{ "target": "...", "qty": 12 } `} "
            bind:value={inputs}
          />
          <label class="label">JSON</label>
        </div>
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
