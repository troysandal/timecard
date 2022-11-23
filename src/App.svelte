<script>
  import svelteLogo from './assets/svelte.svg'
  import TimeCard from './lib/SprintEnduro.svelte'
</script>

<main>
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
</main>

