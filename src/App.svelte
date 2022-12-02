<script>
  import svelteLogo from './assets/svelte.svg'
  import logo from './assets/icon.png';
  import TimeCard from './lib/SprintEnduro.svelte'
  import Tabs from './lib/Tabs.svelte'
  import SprintTab from './lib/SprintTab.svelte'
  import TimeKeeperTab from './lib/TimeKeeperTab.svelte'

  const items = [
    { label: "Sprint Enduro",
		 value: 2,
		 component: SprintTab
		},
    { label: "Time Keeper Enduro",
		 value: 1,
		 component: TimeKeeperTab
		},
  ]
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
    <Tabs {items} />
  </center>
</main>

<style>
  :root(body) {
    -webkit-user-select: none;
    user-select: none;
  }
</style>