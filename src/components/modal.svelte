<script>
  import { createEventDispatcher } from "svelte";

  export let open = false;
  export let ok = true;
  export let cancel = false;

  const dispatch = createEventDispatcher();

  const rnd = (() => {
    const gen = (min, max) =>
      max++ &&
      [...Array(max - min)].map((s, i) => String.fromCharCode(min + i));

    const sets = {
      num: gen(48, 57),
      alphaLower: gen(97, 122),
      alphaUpper: gen(65, 90),
      special: [...`~!@#$%^&*()_+-=[]\{}|;:'",./<>?`],
    };

    function* iter(len, set) {
      if (set.length < 1) set = Object.values(sets).flat();
      for (let i = 0; i < len; i++) yield set[(Math.random() * set.length) | 0];
    }

    return Object.assign(
      (len, ...set) => [...iter(len, set.flat())].join(""),
      sets
    );
  })();

  let id = rnd(20, rnd.alphaLower);

  function okClick() {
    open = false;
    dispatch("click");
  }
  function cancelClick() {
    dispatch("cancel");
  }
</script>

<input type="checkbox" {id} bind:checked={open} class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <slot />
    {#if ok}
      <div class="modal-action">
        <button class="btn" on:click={okClick}>OK</button>
        {#if cancel}
          <button class="btn btn-outline" on:click={cancelClick}>Cancel</button>
        {/if}
      </div>
    {/if}
  </div>
</div>
