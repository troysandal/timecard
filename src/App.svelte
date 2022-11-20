<script>
  import svelteLogo from './assets/svelte.svg'
  import TimeCard from './lib/SprintEnduro.svelte'
</script>

<main>
  <h1>Time Card</h1>
  <p>You can verify your Sprint Enduro score cards
      using this web site. Why would you do that?  Because races are 
      busy places and with hundreds of riders, those hard working club 
      members sometimes enter something incorrectly.  This lets you 
      quickly and easily verify that posted scores are correct.
  </p>
<table>
    <tr>
        <th>
            <div class="scorecard">
                <TimeCard />
            </div>
        </th>
        <th><img alt="hi mom" src="card.jpg" width="300" /></th>
    </tr>
</table>
</main>

