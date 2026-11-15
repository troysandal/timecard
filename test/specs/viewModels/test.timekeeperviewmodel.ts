import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TimeKeeperViewModel } from "../../../src/viewModels/viewModels.svelte"
import type { TimeKeeperScore } from '../../../src/viewModels/ViewModelTypes';
import { TimeKeeperEnduro, type TimeKeeperRace } from "../../../src/models/race";
import { CheckpointTypes, ScoreFormat, Secret } from '../../../src/models/timekeeper';
import { ScoreKeeper } from '../../../src/lib/scoring/timekeeper.scoring';
vi.mock('../../../src/lib/scanCard', async (orig) => ({
  ...(await orig<typeof import('../../../src/lib/scanCard')>()),
  scanCard: vi.fn(),
}))
vi.mock('../../../src/lib/photos', async (orig) => ({
  ...(await orig<typeof import('../../../src/lib/photos')>()),
  deleteImage: vi.fn(async () => {}),
}))
import { scanCard } from '../../../src/lib/scanCard'
import { deleteImage } from '../../../src/lib/photos'


describe("TimeKeeperViewModel", () => {
  function makeTimeKeeperRace(timeCard: TimeKeeperEnduro = new TimeKeeperEnduro(1)): TimeKeeperRace {
    return {
      id: "test",
      name: "Time Keeper Forever",
      createdAt: new Date(),
      raceType: "time_keeper" as const,
      timeCard
    }
  }

  function makeOneCheckViewModel() {
    const enduro = new TimeKeeperEnduro(1)
    enduro.checkpoints.push(new Secret(1))
    return new TimeKeeperViewModel(makeTimeKeeperRace(enduro))
  }

  function scoreCard(viewModel: TimeKeeperViewModel) {
    return (viewModel.score as TimeKeeperScore).scoreCard
  }

  // Scoring rules are covered by the ScoreKeeper unit tests; these only check
  // that the view model wires its race into scoring and reacts to edits.
  describe("scoring", () => {
    it('sums an empty enduro', () => {
      const viewModel = new TimeKeeperViewModel(makeTimeKeeperRace())
      expect(scoreCard(viewModel).points).to.eq(0)
    })

    it("delegates to ScoreKeeper", () => {
      const enduro = new TimeKeeperEnduro(17)
      enduro.checkpoints.push(new Secret(18), new Secret(7, true), new Secret(25))
      const viewModel = new TimeKeeperViewModel(makeTimeKeeperRace(enduro))
      expect(scoreCard(viewModel)).toEqual(ScoreKeeper.scoreEnduro(enduro))
    })

    it("recomputes when the card changes", () => {
      const viewModel = makeOneCheckViewModel()
      const before = scoreCard(viewModel).points
      viewModel.race.timeCard.checkpoints[0]!.minute = 5
      expect(scoreCard(viewModel).points).not.toBe(before)

      viewModel.addCheck()
      expect(scoreCard(viewModel).checkScores.length).toBe(2)
    })

    it("falls back to an empty scorecard when riderMinute is NaN", () => {
      const enduro = new TimeKeeperEnduro(NaN)
      enduro.checkpoints.push(new Secret(1), new Secret(2, true))
      const viewModel = new TimeKeeperViewModel(makeTimeKeeperRace(enduro))
      expect(scoreCard(viewModel)).toEqual({
        points: 0,
        emergencyPoints: 0,
        disqualified: false,
        checkScores: [{
          "disqualified": false,
          "dropped": false,
          "emergencyPoints": 0,
          "invalid": true,
          "points": 0,
        },
        {
          "disqualified": false,
          "dropped": true,
          "emergencyPoints": 0,
          "invalid": true,
          "points": 0,
        }],
        nonDroppedChecks: 0,
      })
    })
  })

  describe('addCheck', () => {
    it('adds checks', () => {
      const viewModel = new TimeKeeperViewModel(makeTimeKeeperRace())
      viewModel.addCheck()
      expect(viewModel.race.timeCard.checkpoints.length).toBe(1)
      expect(scoreCard(viewModel).points).to.eq(0)
    })

    it('adds a secret check at the rider minute', () => {
      const viewModel = new TimeKeeperViewModel(makeTimeKeeperRace(new TimeKeeperEnduro(5)))
      viewModel.addCheck()
      expect(viewModel.race.timeCard.checkpoints[0]).toEqual({
        type: CheckpointTypes.Secret,
        minute: 5,
        seconds: 30,
        drop: false
      })
    })

    it('returns the added check', () => {
      const viewModel = makeOneCheckViewModel()
      const added = viewModel.addCheck()
      expect(added).toBe(viewModel.race.timeCard.checkpoints.at(-1))
    })
  })

  it('resets checks', () => {
    const viewModel = new TimeKeeperViewModel(makeTimeKeeperRace())
    viewModel.race.timeCard.checkpoints.push(new Secret(2))
    expect(scoreCard(viewModel).points).to.eq(1)
    viewModel.resetCard()
    expect(viewModel.race.timeCard.checkpoints).toEqual([{
      type: CheckpointTypes.Secret,
      minute: viewModel.race.timeCard.riderMinute,
      seconds: 30,
      drop: false
    }])
    expect(scoreCard(viewModel).points).to.eq(0)
  })


  describe('delete', () => {
    function makeThreeCheckViewModel() {
      const enduro = new TimeKeeperEnduro(1);
      [1, 2, 3].map((x) => enduro.checkpoints.push(new Secret(x)))
      return new TimeKeeperViewModel(makeTimeKeeperRace(enduro))
    }

    it('not dirty after add then delete', () => {
      const viewModel = new TimeKeeperViewModel(makeTimeKeeperRace())
      expect(viewModel.isDirty).toBe(false)
      viewModel.addCheck()
      expect(viewModel.race.timeCard.checkpoints.length).toBe(1)
      viewModel.deleteCheck(viewModel.race.timeCard.checkpoints[0]!)
      expect(viewModel.isDirty).toBe(false)
      expect(viewModel.race.timeCard.checkpoints.length).toBe(0)
    })

    it('keeps the remaining checks in order', () => {
      const viewModel = makeThreeCheckViewModel()
      viewModel.deleteCheck(viewModel.race.timeCard.checkpoints[1]!)
      expect(viewModel.race.timeCard.checkpoints.map((c) => c.minute)).toEqual([1, 3])
    })

    it('marks the card dirty after deleting an existing check', () => {
      const viewModel = makeThreeCheckViewModel()
      viewModel.deleteCheck(viewModel.race.timeCard.checkpoints[0]!)
      expect(viewModel.isDirty).toBe(true)
    })

    it('matches by reference, so an equal copy of a check deletes nothing', () => {
      const viewModel = makeThreeCheckViewModel()
      viewModel.deleteCheck({ ...viewModel.race.timeCard.checkpoints[1]! })
      expect(viewModel.race.timeCard.checkpoints.length).toBe(3)
    })

    it('does not remove checks not in the race', () => {
      const viewModel = makeThreeCheckViewModel()
      const check = new Secret(1)
      viewModel.deleteCheck(check)
      expect(viewModel.race.timeCard.checkpoints.length).toBe(3)
    })
  })

  describe('isDirty', () => {
    it('returns true when checks have been added', () => {
      const viewModel = new TimeKeeperViewModel(makeTimeKeeperRace())
      expect(viewModel.isDirty).toBe(false)
      viewModel.addCheck()
      expect(viewModel.isDirty).toBe(true)
    })


    it('is true after a time edit and false again once the edit is reverted', () => {
      const viewModel = makeOneCheckViewModel()
      viewModel.race.timeCard.checkpoints[0]!.minute = 2
      expect(viewModel.isDirty).toBe(true)
      viewModel.race.timeCard.checkpoints[0]!.minute = 1
      expect(viewModel.isDirty).toBe(false)
    })

    it('is true after a name change', () => {
      const viewModel = makeOneCheckViewModel()
      viewModel.race.name = 'Renamed'
      expect(viewModel.isDirty).toBe(true)
    })

    it.each<[string, (viewModel: TimeKeeperViewModel) => void]>([
      ['riderMinute', (vm) => { vm.race.timeCard.riderMinute = 2 }],
      ['format', (vm) => { vm.race.timeCard.format = ScoreFormat.NETRA_BrandX }],
      ['check type', (vm) => { vm.race.timeCard.checkpoints[0]!.type = CheckpointTypes.Known }],
      ['check seconds', (vm) => { vm.race.timeCard.checkpoints[0]!.seconds = 15 }],
      ['check drop', (vm) => { vm.race.timeCard.checkpoints[0]!.drop = true }],
    ])('is true after a %s change', (_, edit) => {
      const viewModel = makeOneCheckViewModel()
      edit(viewModel)
      expect(viewModel.isDirty).toBe(true)
    })

    it('treats NaN check fields as equal to NaN check fields', () => {
      const viewModel = makeOneCheckViewModel()
      viewModel.race.timeCard.checkpoints[0]!.minute = NaN
      viewModel.save(() => {})
      expect(viewModel.isDirty).toBe(false)
      viewModel.race.timeCard.checkpoints[0]!.minute = NaN
      expect(viewModel.isDirty).toBe(false)
    })

    it('treats a NaN riderMinute as equal to a NaN riderMinute', () => {
      const viewModel = makeOneCheckViewModel()
      viewModel.race.timeCard.riderMinute = NaN
      viewModel.save(() => {})
      expect(viewModel.isDirty).toBe(false)
      viewModel.race.timeCard.riderMinute = NaN
      expect(viewModel.isDirty).toBe(false)
    })
  })

  describe('saves', () => {
    it('calls onSave once with a copy equal to the race', () => {
      const viewModel = makeOneCheckViewModel()
      const onSave = vi.fn()
      viewModel.save(onSave)
      expect(onSave).toHaveBeenCalledTimes(1)
      const saved = onSave.mock.calls[0]![0]
      expect(saved).toEqual(viewModel.race)
      expect(saved).not.toBe(viewModel.race)
    })

    it('clears the dirty flag', () => {
      const viewModel = makeOneCheckViewModel()
      viewModel.addCheck()
      expect(viewModel.isDirty).toBe(true)
      viewModel.save(() => {})
      expect(viewModel.isDirty).toBe(false)
    })

    it('detaches the saved race from later edits', () => {
      const viewModel = makeOneCheckViewModel()
      let saved: TimeKeeperRace | undefined
      viewModel.save((race) => { saved = race })
      viewModel.race.timeCard.checkpoints[0]!.minute = 9
      expect(saved!.timeCard.checkpoints[0]!.minute).toBe(1)
      expect(viewModel.isDirty).toBe(true)
    })

    it('is dirty again after an edit made following a save', () => {
      const viewModel = makeOneCheckViewModel()
      viewModel.save(() => {})
      viewModel.race.name = 'Renamed'
      expect(viewModel.isDirty).toBe(true)
    })

    it('is not affected by the caller mutating the saved copy', () => {
      const viewModel = makeOneCheckViewModel()
      let saved: TimeKeeperRace | undefined
      viewModel.save((race) => { saved = race })
      saved!.name = 'Mutated by caller'
      saved!.timeCard.checkpoints[0]!.minute = 9
      expect(viewModel.isDirty).toBe(false)
    })
  })
})

describe("TimeKeeperViewModel photo & scan", () => {
  const newVm = () => new TimeKeeperViewModel({
    id: "t", name: "n", createdAt: new Date(), raceType: "time_keeper", timeCard: new TimeKeeperEnduro(1)
  })
  const scanMock = vi.mocked(scanCard)
  const okRows = (rows: { c1: string; c2: string; c3: string }[]) =>
    ({ status: 'ok', imagePath: 't/scans/a.jpg', result: { rows, warnings: [], image: { path: '', webPath: '' } } }) as any

  beforeEach(() => { vi.clearAllMocks() })

  it('is dirty when imagePath changes and clean after save', () => {
    const vm = newVm()
    expect(vm.isDirty).toBe(false)
    vm.race.imagePath = "t/scans/a.jpg"
    expect(vm.isDirty).toBe(true)
    vm.save(() => {})
    expect(vm.isDirty).toBe(false)
  })

  it('resetCard clears the photo', () => {
    const vm = newVm()
    vm.race.imagePath = "t/scans/a.jpg"
    vm.resetCard()
    expect(vm.race.imagePath).toBeUndefined()
  })

  it('rowEntered adds a check only on the last row', () => {
    const vm = newVm()
    vm.resetCard()
    vm.addCheck()
    const n = vm.race.timeCard.checkpoints.length
    vm.rowEntered(0)
    expect(vm.race.timeCard.checkpoints.length).toBe(n)
    vm.rowEntered(n - 1)
    expect(vm.race.timeCard.checkpoints.length).toBe(n + 1)
  })

  it('scan applies rows and keeps the photo', async () => {
    scanMock.mockResolvedValue(okRows([{ c1: '12:30', c2: '', c3: '' }]))
    const vm = newVm()
    expect(await vm.scan()).toBe('applied')
    expect(vm.race.timeCard.checkpoints.length).toBeGreaterThan(0)
    expect(vm.race.imagePath).toBe('t/scans/a.jpg')
  })

  it('scan with no usable rows deletes the photo and changes nothing', async () => {
    scanMock.mockResolvedValue(okRows([]))
    const vm = newVm()
    expect(await vm.scan()).toBe('empty')
    expect(deleteImage).toHaveBeenCalledWith('t/scans/a.jpg')
    expect(vm.race.imagePath).toBeUndefined()
  })

  it('scan with no table deletes the photo and fails; cancel is a no-op', async () => {
    scanMock.mockResolvedValue({ status: 'no-table', imagePath: 't/scans/b.jpg' })
    expect(await newVm().scan()).toBe('failed')
    expect(deleteImage).toHaveBeenCalledWith('t/scans/b.jpg')
    vi.clearAllMocks()
    scanMock.mockResolvedValue({ status: 'cancelled' })
    expect(await newVm().scan()).toBe('cancelled')
    expect(deleteImage).not.toHaveBeenCalled()
  })
})
