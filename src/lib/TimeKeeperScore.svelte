<script lang="ts">
    import { type ScoreCard } from "../timekeeper.scoring.base"

    let {
        scoreCard
    }: { scoreCard: ScoreCard } = $props();
</script>

<table class="border-collapse [&_td]:p-1 md:[&_td]:p-2" style="margin:auto">
    <tbody>
        <tr>
            <th class="text-center">Checks</th>
            <th class="text-center">Points</th>
            <th class="text-center">Emergency<br />Points</th>
            <th class="text-center">Disqualified</th>
        </tr>
        <tr>
            <td><input class="field h-6 md:h-10 text-center" id="checks" disabled value={scoreCard.nonDroppedChecks} size="2" /></td>
            <td><input class="field h-6 md:h-10 text-center" id="points" disabled value={scoreCard.points} size="4" /></td>
            <td><input class="field h-6 md:h-10 text-center" id="emergencyPoints" disabled value={scoreCard.emergencyPoints} size="4" /></td>
            <td><input class="field h-6 md:h-10 text-center" id="disqualified" disabled value={scoreCard.disqualified ? "YES" : "NO"} size="4" /></td>
        </tr>
    </tbody>
</table>
