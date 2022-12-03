<script>
  import svelteLogo from './assets/svelte.svg'
  import logo from './assets/icon.png';
  import TimeCard from './lib/SprintEnduro.svelte'
  import SprintEnduro from './lib/SprintEnduro.svelte';
  import TimeKeeperEnduro from './lib/TimeKeeperEnduro.svelte';

  let current = "sprint"
</script>

<svelte:head>
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link rel="apple-touch-icon" href={logo} />
  <meta name="apple-mobile-web-app-title" content="Enduro Time Card" />
  <link red="manifest" crossorigin="use-credentials" href="manifest.json" />
</svelte:head>
<main>
  <center>
    <h1>Enduro Time Card</h1>
    <p>You can verify your Enduro score cards using this tool. Why would
      you do that?  Because races are busy places and with hundreds of riders,
      those hard working club members sometimes enter something incorrectly.
    </p>
    <button class:selected={current === "sprint"} on:click={() => current = "sprint"}>Sprint</button>
    <button class:selected={current === "timeKeeper"} on:click={() => current = "timeKeeper"}>Time Keeper</button>
    {#if current === "sprint"}
      <div id="sprint">
        <h2>Sprint Enduro</h2>
        <p>
            Enter <b>Time In</b> and <b>Time Out</b> as HH:MM:SS.
        </p>
        <TimeCard />
      </div>
    {:else}
        <div id="timeKeeper">
          <h2>Time Keeper Enduro</h2>
          <p>Tap Flags to change check type.</p>
          <TimeKeeperEnduro />
      </div>
    {/if}
  </center>
</main>

<style>
  :root(body) {
    -webkit-user-select: none;
    user-select: none;
  }
  .selected {
		font-weight: bold;
  }
</style>