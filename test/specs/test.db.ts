import { expect } from "chai"
import { unwrapDB } from '../../src/db/database'

describe('Database', () => {
  it('throws error for missing schemaVersion', () => {
    const db = {
      races: []
    };
    expect(() => unwrapDB(db)).to.throw("missing or invalid schemaVersion");
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
    const revivedDb: any = unwrapDB(db);
    expect(revivedDb.data.races[0].createdAt).to.be.an.instanceOf(Date);
  })

  describe('NaN handling', () => {
    it('revives NaN values in SprintEnduroData', () => {
      const db = {
        schemaVersion: 1,
        races: [
          {
            raceType: 'sprint',
            name: "JackHammer",
            createdAt: "2026-11-06T17:12:57.128Z",
            timeCard: {
              tests: [
                {
                  enter: { hour: null, minute: null, second: null },
                  exit: { hour: null, minute: null, second: null }
                }
              ]
            }
          },
          {
            raceType: 'time_keeper',
            name: "Cowbell",
            createdAt: "2026-11-06T17:12:57.128Z",
            timeCard: {
              riderMinute: null,
              checkpoints: [
                { type: 0, minute: null, seconds: null, drop: false},
                { type: 1, minute: null, seconds: null, drop: false},
                { type: 2, minute: null, seconds: null, drop: false},
                { type: 3, minute: null, seconds: null, drop: false}
              ]
            }
          }
        ]
      };
      const unwrappedDb: any = unwrapDB(db);
      const test = unwrappedDb.data.races[0].timeCard.tests[0];
      expect(test.enter.hour).to.be.NaN;
      expect(test.exit.minute).to.be.NaN;
    })
  })

  describe('migrates old schema to new schema', () => {
    it('v1 -> v2', () => {
      const oldDb = {
        schemaVersion: 1,
        races: [
          {
            raceType: 'time_keeper',
            name: "Terra JackHammer",
            createdAt: "2026-11-06T17:12:57.128Z",
            timeCard: {
              riderMinute: 14,
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
        races: [
          {
            raceType: 'time_keeper',
            name: "Terra JackHammer",
            createdAt: new Date("2026-11-06T17:12:57.128Z"),
            timeCard: {
              riderMinute: 14,
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
      const unwrappedDb = unwrapDB(oldDb) as any;
      expect(unwrappedDb.data).to.deep.equal(expectedDb);
    })
    
    it('v2 -> v2', () => {
      const oldDb = {
        schemaVersion: 2,
        races: [
          {
            raceType: 'time_keeper',
            name: "Terra JackHammer",
            createdAt: "2026-11-06T17:12:57.128Z",
            timeCard: {
              riderMinute: 14,
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

      const expectedDb = {
        races: [
          {
            raceType: 'time_keeper',
            name: "Terra JackHammer",
            createdAt: new Date("2026-11-06T17:12:57.128Z"),
            timeCard: {
              riderMinute: 14,
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

      const unwrappedDb = unwrapDB(oldDb) as any;
      expect(unwrappedDb.data).to.deep.equal(expectedDb);
    })
  })
})