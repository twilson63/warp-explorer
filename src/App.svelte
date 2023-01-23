<script>
  import { Route, router } from "tinro";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";

  import Home from "./pages/home.svelte";
  import Write from "./pages/write.svelte";
  import Balances from "./pages/balances.svelte";

  router.mode.hash();
  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Announcer />
<Transition>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/read/:contractID" let:meta>
    <Home contractID={meta.params.contractID} />
  </Route>
  <Route path="/write/:contractID" let:meta>
    <Write contractID={meta.params.contractID} />
  </Route>
  <Route path="/write">
    <Write />
  </Route>
  <Route path="/balances">
    <Balances />
  </Route>
</Transition>
