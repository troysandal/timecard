<script lang="ts">
    let {
        totalChecks,
        points,
        emergencyPoints,
        disqualified
    } = $props();
</script>

<table style="margin:auto">
    <tbody>
        <tr>
            <th>Checks</th>
            <th>Points</th>
            <th>Emergency<br />Points</th>
            <th>Disqualified</th>
        </tr>
        <tr>
            <td><input id="checks" disabled value={totalChecks} size="2" style="width:2em"/></td>
            <td><input id="points" disabled value={points} size="4" style="width:3em"/></td>
            <td><input id="emergencyPoints" disabled value={emergencyPoints} size="4" style="width:3em"/></td>
            <td><input id="disqualified" disabled value={disqualified} size="4" style="width:3em"/></td>
        </tr>
    </tbody>
</table>

<style>
    th {
        vertical-align: bottom;
        font-size: 12px;
    }
    input {
        text-align: center;
    }
    td {
        text-align: center;
    }
</style>