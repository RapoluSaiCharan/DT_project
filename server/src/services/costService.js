/**
 * Service for calculating shared transport costs
 */
const calculateTripCost = ({
  totalCost = 0,
  passengerCount = 1,
  driverContribution = 0,
  distanceKm = 0,
}) => {
  const numericTotal = Math.max(0, parseFloat(totalCost) || 0);
  const numericPassengers = Math.max(1, parseInt(passengerCount, 10) || 1);
  const numericDriverShare = Math.max(0, parseFloat(driverContribution) || 0);

  // Amount remaining to be split among passengers
  const splitAmount = Math.max(0, numericTotal - numericDriverShare);

  // Cost per passenger rounded to nearest integer or 2 decimal places
  const costPerPerson = Math.round((splitAmount / numericPassengers) * 100) / 100;

  // Comparison with standard solo ride cost estimation (₹15/km base auto/cab)
  const soloEstimatedCost = distanceKm > 0 ? Math.round(distanceKm * 18 + 40) : Math.round(numericTotal);
  const estimatedSavingsPerPerson = Math.max(0, soloEstimatedCost - costPerPerson);

  return {
    totalCost: numericTotal,
    passengerCount: numericPassengers,
    driverContribution: numericDriverShare,
    costPerPerson,
    estimatedSavingsPerPerson,
    currency: 'INR',
    currencySymbol: '₹',
  };
};

module.exports = {
  calculateTripCost,
};
