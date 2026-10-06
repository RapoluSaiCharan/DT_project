const { describe, it } = require('node:test');
const assert = require('node:assert');
const { calculateTripCost } = require('../src/services/costService');
const { timeToMinutes } = require('../src/services/matchingService');
const { generateToken, verifyToken } = require('../src/utils/jwt');

describe('CampusPool Backend Test Suite', () => {
  describe('1. Cost Calculation Service', () => {
    it('should accurately split total cost among passengers', () => {
      const result = calculateTripCost({
        totalCost: 300,
        passengerCount: 4,
        driverContribution: 0,
      });

      assert.strictEqual(result.costPerPerson, 75);
      assert.strictEqual(result.passengerCount, 4);
      assert.strictEqual(result.currency, 'INR');
    });

    it('should respect driver contribution before splitting', () => {
      const result = calculateTripCost({
        totalCost: 200,
        passengerCount: 3,
        driverContribution: 50,
      });

      // (200 - 50) / 3 = 150 / 3 = 50
      assert.strictEqual(result.costPerPerson, 50);
      assert.strictEqual(result.driverContribution, 50);
    });

    it('should prevent divide by zero and negative costs gracefully', () => {
      const result = calculateTripCost({
        totalCost: -100,
        passengerCount: 0,
      });

      assert.strictEqual(result.costPerPerson, 0);
      assert.strictEqual(result.passengerCount, 1);
    });
  });

  describe('2. Time and Route Matching Algorithm', () => {
    it('should convert HH:MM string to minutes correctly', () => {
      assert.strictEqual(timeToMinutes('08:00'), 480);
      assert.strictEqual(timeToMinutes('08:30'), 510);
      assert.strictEqual(timeToMinutes('17:15'), 1035);
    });

    it('should identify within-tolerance departures', () => {
      const userMin = timeToMinutes('08:00');
      const poolMin = timeToMinutes('08:15');
      const diff = Math.abs(userMin - poolMin);

      assert.strictEqual(diff, 15);
      assert.strictEqual(diff <= 30, true);
    });
  });

  describe('3. JWT Authentication Security', () => {
    it('should sign and verify JWT payload correctly', () => {
      const fakeUser = {
        _id: '65e31fa29cb274001cf4b123',
        role: 'STUDENT',
        email: 'student@college.edu',
      };

      const token = generateToken(fakeUser);
      assert.ok(typeof token === 'string');

      const decoded = verifyToken(token);
      assert.strictEqual(decoded.id, fakeUser._id);
      assert.strictEqual(decoded.role, fakeUser.role);
      assert.strictEqual(decoded.email, fakeUser.email);
    });
  });
});
