module.exports = {
    param(data, key) {
      if (Object.keys(data).length === 0) throw error(`No parameters provided. Please provide the required parameters.`);
      else {
        if (data[key] === undefined) {
          throw error(`The parameter (${key}) is missing. Please provide it.`);
        } else {
          return data[key];
        }
      }
    },
  };