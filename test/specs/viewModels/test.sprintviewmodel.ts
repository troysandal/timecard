import { describe, expect, it } from 'vitest'
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
  describe("scoring", () => {
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
    })
  })
})