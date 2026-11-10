/// <reference types="cypress" />

import { addEmergency, setSecret, checkScore, setRiderMinute, newTimeKeeper } from './timekeeper_util';

describe('Time Keeper Bugs', () => {
    it('negative emergency points', () => {
      newTimeKeeper(10)

      setSecret(10)
      addEmergency(10, 31)
      checkScore(2, 0, 1, false)
    })

    
})