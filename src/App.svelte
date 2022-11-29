<script>
  import svelteLogo from './assets/svelte.svg'
  import logo from './assets/icon.png';
  import TimeCard from './lib/SprintEnduro.svelte'
</script>

<svelte:head>
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <link rel="apple-touch-icon" href={logo}>
  <meta name="apple-mobile-web-app-title" content="Enduro Time Card">
</svelte:head>
<main>
  <center>
    <h1>Time Card</h1>
    <p>You can verify your Sprint Enduro score cards
        using this web site. Why would you do that?  Because races are 
        busy places and with hundreds of riders, those hard working club 
        members sometimes enter something incorrectly.
    </p>
    <p>
      Enter <b>Time In</b> and <b>Time Out</b> as HH:MM:SS.
    </p>
    <TimeCard />
  </center>
</main>

<style>
  :root(body) {
   -webkit-user-select: none;
   user-select: none;
}
</style>