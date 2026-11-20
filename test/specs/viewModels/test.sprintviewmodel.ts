import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SprintViewModel } from "../../../src/viewModels/viewModels.svelte"
import type { SprintScore } from '../../../src/viewModels/ViewModelTypes';
import type { SprintEnduroData, SprintRace } from "../../../src/models/race";
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


describe("SprintViewModel", () => {
  function makeSprintRace(timeCard: SprintEnduroData): SprintRace {
    return {
      id: "test",
      name: "Test Sprint",
      createdAt: new Date(),
      raceType: "sprint" as const,
      timeCard
    }
  }

  function makeOneTestViewModel() {
    return new SprintViewModel(makeSprintRace({
      tests: [{
        enter: { hour: 1, minute: 0, second: 0 },
        exit: { hour: 1, minute: 1, second: 0 }
      }]
    }))
  }

  describe("scoring", () => {
    it('sums an empty sprint', () => {
      const viewModel = new SprintViewModel(makeSprintRace({tests: []}))
      expect((viewModel.score as SprintScore).score).toEqual({ hour: NaN, minute: NaN, second: NaN })
    })
    
    it("returns NaN for Nan test field", () => {
      const sprintData: SprintEnduroData = {
        tests: [
          {
            enter: { hour: NaN, minute: 0, second: 0 },
            exit: { hour: 1, minute: 1, second: 1 }
          }
        ]
      }
      const viewModel = new SprintViewModel(makeSprintRace(sprintData))
      expect((viewModel.score as SprintScore).score).toEqual({ hour: NaN, minute: NaN, second: NaN })
    })

    it("sums up multiple tests", () => {
      const sprintData: SprintEnduroData = {
        tests: [
          {
            enter: { hour: 0, minute: 0, second: 0 },
            exit: { hour: 1, minute: 1, second: 1 }
          },
          {
            enter: { hour: 0, minute: 0, second: 0 },
            exit: { hour: 1, minute: 1, second: 1 }
          }
        ]
      }
      const viewModel = new SprintViewModel(makeSprintRace(sprintData))
      expect((viewModel.score as SprintScore).score).toEqual({ hour: 2, minute: 2, second: 2 })
      
      viewModel.addTestData()
      viewModel.race.timeCard.tests[2]! = {
        enter: { hour: 0, minute: 0, second: 0 },
        exit: { hour: 1, minute: 1, second: 1 }
      }
      expect((viewModel.score as SprintScore).score).toEqual({ hour: 3, minute: 3, second: 3 })
    })
  })

  it('adds tests', () => {
    const viewModel = new SprintViewModel(makeSprintRace({tests: []}))
    viewModel.addTestData()
    expect(viewModel.race.timeCard.tests.length).toBe(1)
    expect((viewModel.score as SprintScore).score).toEqual({ hour: NaN, minute: NaN, second: NaN })
  })

  it('resets tests', () => {
    const viewModel = new SprintViewModel(makeSprintRace({tests: []}))
    viewModel.addTestData()
    viewModel.race.timeCard.tests[0]! = {
      enter: { hour: 0, minute: 0, second: 0 },
      exit: { hour: 1, minute: 1, second: 1 }
    }
    expect((viewModel.score as SprintScore).score).toEqual({ hour: 1, minute: 1, second: 1 })
    viewModel.resetCard()
    expect(viewModel.race.timeCard.tests.length).toBe(1)
    expect((viewModel.score as SprintScore).score).toEqual({ hour: NaN, minute: NaN, second: NaN })
  })


  describe('delete', () => {
    function makeThreeTestViewModel() {
      return new SprintViewModel(makeSprintRace({
        tests: [1, 2, 3].map((hour) => ({
          enter: { hour, minute: 0, second: 0 },
          exit: { hour, minute: 1, second: 0 }
        }))
      }))
    }

    it('not dirty after add then delete', () => {
      const viewModel = new SprintViewModel(makeSprintRace({tests: []}))
      expect(viewModel.isDirty).toBe(false)
      viewModel.addTestData()
      expect(viewModel.race.timeCard.tests.length).toBe(1)
      viewModel.deleteTest(viewModel.race.timeCard.tests[0]!)
      expect(viewModel.isDirty).toBe(false)
      expect(viewModel.race.timeCard.tests.length).toBe(0)
    })

    it('keeps the remaining tests in order', () => {
      const viewModel = makeThreeTestViewModel()
      viewModel.deleteTest(viewModel.race.timeCard.tests[1]!)
      expect(viewModel.race.timeCard.tests.map((t) => t.enter.hour)).toEqual([1, 3])
    })

    it('marks the card dirty after deleting an existing test', () => {
      const viewModel = makeThreeTestViewModel()
      viewModel.deleteTest(viewModel.race.timeCard.tests[0]!)
      expect(viewModel.isDirty).toBe(true)
    })

    it('matches by reference, so an equal copy of a test deletes nothing', () => {
      const viewModel = makeThreeTestViewModel()
      viewModel.deleteTest({ ...viewModel.race.timeCard.tests[1]! })
      expect(viewModel.race.timeCard.tests.length).toBe(3)
    })
    it('does not remove tests not in the race', () => {
      const viewModel = makeThreeTestViewModel()
      const test = {
        enter: { hour: 1, minute: 0, second: 0 },
        exit: { hour: 1, minute: 1, second: 0 }
      }
      viewModel.deleteTest(test)
      expect(viewModel.race.timeCard.tests.length).toBe(3)
    })
  })

  describe('isDirty', () => {
    it('returns true when tests have been added', () => {
      const viewModel = new SprintViewModel(makeSprintRace({tests: []}))
      expect(viewModel.isDirty).toBe(false)
      viewModel.addTestData()
      expect(viewModel.isDirty).toBe(true)
    })


    it('is true after a time edit and false again once the edit is reverted', () => {
      const viewModel = makeOneTestViewModel()
      viewModel.race.timeCard.tests[0]!.exit.minute = 2
      expect(viewModel.isDirty).toBe(true)
      viewModel.race.timeCard.tests[0]!.exit.minute = 1
      expect(viewModel.isDirty).toBe(false)
    })

    it('is true after a name change', () => {
      const viewModel = makeOneTestViewModel()
      viewModel.race.name = 'Renamed'
      expect(viewModel.isDirty).toBe(true)
    })

    it('treats NaN fields as equal to NaN fields', () => {
      const viewModel = new SprintViewModel(makeSprintRace({tests: []}))
      viewModel.resetCard()
      viewModel.save(() => {})
      expect(viewModel.isDirty).toBe(false)
      viewModel.resetCard()
      expect(viewModel.isDirty).toBe(false)
    })
  })

  describe('saves', () => {
    it('calls onSave once with a copy equal to the race', () => {
      const viewModel = makeOneTestViewModel()
      const onSave = vi.fn()
      viewModel.save(onSave)
      expect(onSave).toHaveBeenCalledTimes(1)
      const saved = onSave.mock.calls[0]![0]
      expect(saved).toEqual(viewModel.race)
      expect(saved).not.toBe(viewModel.race)
    })

    it('clears the dirty flag', () => {
      const viewModel = makeOneTestViewModel()
      viewModel.addTestData()
      expect(viewModel.isDirty).toBe(true)
      viewModel.save(() => {})
      expect(viewModel.isDirty).toBe(false)
    })

    it('detaches the saved race from later edits', () => {
      const viewModel = makeOneTestViewModel()
      let saved: SprintRace | undefined
      viewModel.save((race) => { saved = race })
      viewModel.race.timeCard.tests[0]!.exit.minute = 9
      expect(saved!.timeCard.tests[0]!.exit.minute).toBe(1)
      expect(viewModel.isDirty).toBe(true)
    })

    it('is dirty again after an edit made following a save', () => {
      const viewModel = makeOneTestViewModel()
      viewModel.save(() => {})
      viewModel.race.name = 'Renamed'
      expect(viewModel.isDirty).toBe(true)
    })

    it('is not affected by the caller mutating the saved copy', () => {
      const viewModel = makeOneTestViewModel()
      let saved: SprintRace | undefined
      viewModel.save((race) => { saved = race })
      saved!.name = 'Mutated by caller'
      saved!.timeCard.tests[0]!.exit.minute = 9
      expect(viewModel.isDirty).toBe(false)
    })
  })
})

describe("SprintViewModel photo & scan", () => {
  const newVm = () => new SprintViewModel({
    id: "t", name: "n", createdAt: new Date(), raceType: "sprint", timeCard: { tests: [] }
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

  it('rowEntered adds a test only on the last row', () => {
    const vm = newVm()
    vm.addTestData()
    vm.addTestData()
    vm.rowEntered(0)
    expect(vm.race.timeCard.tests.length).toBe(2)
    vm.rowEntered(1)
    expect(vm.race.timeCard.tests.length).toBe(3)
  })

  it('scan applies rows and keeps the photo', async () => {
    scanMock.mockResolvedValue(okRows([{ c1: '9', c2: '37', c3: '00' }, { c1: '9', c2: '55', c3: '34' }]))
    const vm = newVm()
    expect(await vm.scan()).toBe('applied')
    expect(vm.race.timeCard.tests.length).toBeGreaterThan(0)
    expect(vm.race.imagePath).toBe('t/scans/a.jpg')
    expect(deleteImage).not.toHaveBeenCalled()
  })

  it('scan with no usable rows deletes the photo and changes nothing', async () => {
    scanMock.mockResolvedValue(okRows([]))
    const vm = newVm()
    expect(await vm.scan()).toBe('empty')
    expect(deleteImage).toHaveBeenCalledWith('t/scans/a.jpg')
    expect(vm.race.imagePath).toBeUndefined()
  })

  it('scan with no table deletes the photo and fails', async () => {
    scanMock.mockResolvedValue({ status: 'no-table', imagePath: 't/scans/b.jpg' })
    expect(await newVm().scan()).toBe('failed')
    expect(deleteImage).toHaveBeenCalledWith('t/scans/b.jpg')
  })

  it('cancelled scan does nothing', async () => {
    scanMock.mockResolvedValue({ status: 'cancelled' })
    const vm = newVm()
    expect(await vm.scan()).toBe('cancelled')
    expect(deleteImage).not.toHaveBeenCalled()
    expect(vm.isDirty).toBe(false)
  })

  it('is scanning from the call until the result is applied, and not afterwards', async () => {
    let finish: (v: any) => void = () => {}
    scanMock.mockReturnValue(new Promise((resolve) => { finish = resolve }))
    const vm = newVm()
    expect(vm.scanning).toBe(false)
    const pending = vm.scan()
    expect(vm.scanning).toBe(true)
    finish({ status: 'cancelled' })
    expect(await pending).toBe('cancelled')
    expect(vm.scanning).toBe(false)
  })

  it('a second scan while one is running does nothing and reports busy', async () => {
    let finish: (v: any) => void = () => {}
    scanMock.mockReturnValue(new Promise((resolve) => { finish = resolve }))
    const vm = newVm()
    const first = vm.scan()
    expect(await vm.scan()).toBe('busy')
    expect(scanMock).toHaveBeenCalledTimes(1)
    finish(okRows([{ c1: '9', c2: '37', c3: '00' }, { c1: '9', c2: '55', c3: '34' }]))
    expect(await first).toBe('applied')
  })

  it('stops scanning when the scan throws, so the screen is not left disabled', async () => {
    scanMock.mockRejectedValue(new Error('boom'))
    const vm = newVm()
    await expect(vm.scan()).rejects.toThrow('boom')
    expect(vm.scanning).toBe(false)
  })

  it('maps the plugin being busy to busy, without touching the photo', async () => {
    scanMock.mockResolvedValue({ status: 'busy' })
    const vm = newVm()
    expect(await vm.scan()).toBe('busy')
    expect(deleteImage).not.toHaveBeenCalled()
  })

  describe('cancelling a scan', () => {
    const pendingScan = () => {
      let finish: (v: any) => void = () => {}
      const promise = new Promise((resolve) => { finish = resolve })
      return { promise, finish }
    }
    const twoRows = [{ c1: '9', c2: '37', c3: '00' }, { c1: '9', c2: '55', c3: '34' }]

    it('throws the result away: nothing is applied and the saved photo is deleted when it arrives', async () => {
      const p = pendingScan()
      scanMock.mockReturnValue(p.promise as any)
      const vm = newVm()
      const run = vm.scan()
      expect(vm.scanning).toBe(true)
      vm.cancelScan()
      expect(vm.scanning).toBe(false) // the dialog goes away at once, not when the read finishes
      p.finish(okRows(twoRows))
      expect(await run).toBe('cancelled')
      expect(vm.race.timeCard.tests.length).toBe(0)
      expect(vm.race.imagePath).toBeUndefined()
      expect(deleteImage).toHaveBeenCalledWith('t/scans/a.jpg')
      expect(vm.scanning).toBe(false)
    })

    it('also deletes the photo of a cancelled scan that found no table', async () => {
      const p = pendingScan()
      scanMock.mockReturnValue(p.promise as any)
      const vm = newVm()
      const run = vm.scan()
      vm.cancelScan()
      p.finish({ status: 'no-table', imagePath: 't/scans/b.jpg' })
      expect(await run).toBe('cancelled')
      expect(deleteImage).toHaveBeenCalledWith('t/scans/b.jpg')
    })

    it('does not delete anything when the user had already cancelled in the camera', async () => {
      const p = pendingScan()
      scanMock.mockReturnValue(p.promise as any)
      const vm = newVm()
      const run = vm.scan()
      vm.cancelScan()
      p.finish({ status: 'cancelled' })
      expect(await run).toBe('cancelled')
      expect(deleteImage).not.toHaveBeenCalled()
    })

    it('lets a new scan start at once, and the old result never touches it', async () => {
      const first = pendingScan()
      const second = pendingScan()
      scanMock.mockReturnValueOnce(first.promise as any).mockReturnValueOnce(second.promise as any)
      const vm = newVm()
      const run1 = vm.scan()
      vm.cancelScan()
      const run2 = vm.scan() // not 'busy': the cancelled scan no longer counts
      expect(vm.scanning).toBe(true)

      // the cancelled read finishes first: it must not switch the dialog off or apply anything
      first.finish({ ...okRows([{ c1: '1', c2: '11', c3: '11' }, { c1: '1', c2: '22', c3: '22' }]), imagePath: 't/scans/old.jpg' })
      expect(await run1).toBe('cancelled')
      expect(vm.scanning).toBe(true)
      expect(vm.race.timeCard.tests.length).toBe(0)
      expect(deleteImage).toHaveBeenCalledWith('t/scans/old.jpg')

      second.finish(okRows(twoRows))
      expect(await run2).toBe('applied')
      expect(vm.race.imagePath).toBe('t/scans/a.jpg')
      expect(vm.race.timeCard.tests.length).toBe(1)
      expect(vm.scanning).toBe(false)
    })

    it('does nothing when no scan is running', () => {
      const vm = newVm()
      vm.cancelScan()
      expect(vm.scanning).toBe(false)
      expect(deleteImage).not.toHaveBeenCalled()
    })
  })
})
