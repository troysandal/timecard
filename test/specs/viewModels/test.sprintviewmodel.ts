import { describe, expect, it, vi } from 'vitest'
import { SprintViewModel } from "../../../src/viewModels/viewModels.svelte"
import type { SprintScore } from '../../../src/viewModels/ViewModelTypes';
import type { SprintEnduroData, SprintRace } from "../../../src/models/race";

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