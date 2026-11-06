import { expect } from "chai"
import { reviveDB } from '../../src/db/store'

describe('Database', () => {
  it('throws error for missing schemaVersion', () => {
    const db = {
      races: []
    };
    expect(() => reviveDB(db)).to.throw("missing or invalid schemaVersion");
  })

  it('revives race createdAt dates', () => {
    const db = {
      schemaVersion: 1,
      races: [
        {
          raceType: 'sprint',
          name: "Terra JackHammer",
          createdAt: "2026-11-06T17:12:57.128Z",
          timeCard: {
            tests: []
          }
        }
      ]
    };
    const revivedDb: any = reviveDB(db);
    expect(revivedDb.races[0].createdAt).to.be.an.instanceOf(Date);
  })

  describe('NaN handling', () => {
    it('revives NaN values in SprintEnduroData', () => {
      const db = {
        schemaVersion: 1,
        races: [
          {
            raceType: 'sprint',
            name: "Terra JackHammer",
            createdAt: "2026-11-06T17:12:57.128Z",
            timeCard: {
              tests: [
                {
                  enter: { hour: null, minute: null, second: null },
                  exit: { hour: null, minute: null, second: null }
                }
              ]
            }
          }
        ]
      };
      const revivedDb: any = reviveDB(db);
      const test = revivedDb.races[0].timeCard.tests[0];
      expect(test.enter.hour).to.be.NaN;
      expect(test.exit.minute).to.be.NaN;
    })
  })

  it('migrates old schema to new schema', () => {
    const oldDb = {
      schemaVersion: 1,
      races: [
        {
          raceType: 'time_keeper',
          name: "Terra JackHammer",
          createdAt: "2026-11-06T17:12:57.128Z",
          timeCard: {
            checkpoints: [
              { type: 0, minute: 0, second: 0, drop: false},
              { type: 1, minute: 0, second: 0, drop: false},
              { type: 2, minute: 0, second: 0, drop: false},
              { type: 3, minute: 0, second: 0, drop: false}
            ]
          }
        }
      ]
    };
    const expectedDb = {
      schemaVersion: 2,
      races: [
        {
          raceType: 'time_keeper',
          name: "Terra JackHammer",
          createdAt: new Date("2026-11-06T17:12:57.128Z"),
          timeCard: {
            checkpoints: [
              { type: 'start', minute: 0, second: 0, drop: false},
              { type: 'known', minute: 0, second: 0, drop: false},
              { type: 'secret', minute: 0, second: 0, drop: false},
              { type: 'emergency', minute: 0, second: 0, drop: false}
            ]
          }
        }
      ]
    }

    expect(reviveDB(oldDb)).to.deep.equal(expectedDb);
  })
})