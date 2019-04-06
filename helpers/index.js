export default {
  parseSimulationData: (input) => {
    const array = input.split(',');
    return {
      step: array[0].trim(),
      duration: parseFloat(array[1].trim()),
      production_rate: parseFloat(array[2].trim()),
    };
  },
};
