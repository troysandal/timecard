<script lang="ts">
    import { type ScoreCard } from "../timekeeper.scoring.base"

    let {
        scoreCard
    }: { scoreCard: ScoreCard } = $props();
</script>

<table class="table [&_tr>*]:border-none table-xs md:table-md" style="margin:auto">
    <tbody>
        <tr>
            <th class="text-center">Checks</th>
            <th class="text-center">Points</th>
            <th class="text-center">Emergency<br />Points</th>
            <th class="text-center">Disqualified</th>
        </tr>
        <tr>
            <td><input class="input input-bordered input-xs md:input-md text-center" id="checks" disabled value={scoreCard.nonDroppedChecks} size="2" /></td>
            <td><input class="input input-bordered input-xs md:input-md text-center" id="points" disabled value={scoreCard.points} size="4" /></td>
            <td><input class="input input-bordered input-xs md:input-md text-center" id="emergencyPoints" disabled value={scoreCard.emergencyPoints} size="4" /></td>
            <td><input class="input input-bordered input-xs md:input-md text-center" id="disqualified" disabled value={scoreCard.disqualified ? "YES" : "NO"} size="4" /></td>
        </tr>
    </tbody>
</table>
