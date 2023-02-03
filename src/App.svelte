<script>
  import svelteLogo from './assets/svelte.svg'
  import logo from './assets/icon.png';
  import TimeCard from './lib/SprintEnduro.svelte'
  import SprintEnduro from './lib/SprintEnduro.svelte';
  import TimeKeeperEnduro from './lib/TimeKeeperEnduro.svelte';

  let current = "sprint"
  function switchTimeCard(nextCard) {
    if (current === nextCard) {
      return
    }
    if (window.confirm('Switching time cards will lose all data. Are you sure?')) {
      current = nextCard
    }
  }
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
    <p>Verify Enduro score cards using this tool. Races are busy places and with
      hundreds of riders, hard working club members sometimes make mistakes.
      <a href="https://mobilesyrup.com/2020/05/24/how-install-progressive-web-app-pwa-android-ios-pc-mac/">
      <b>Install</b></a> onto your phone before the race!
    </p>
    <button class:selected={current === "sprint"} on:click={() => switchTimeCard("sprint")}>Sprint</button>
    <button class:selected={current === "timeKeeper"} on:click={() => switchTimeCard("timeKeeper")}>Time Keeper</button>
    {#if current === "sprint"}
      <div id="sprint">
        <h2>Sprint Enduro</h2>
        <p>
            Enter <b>Hours</b> in 24 Hour Time, e.g. 2PM == 14
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