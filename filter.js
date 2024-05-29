const fs = require("fs");

// Function to filter data
const filterData = (data) => {
  // The filter method loops over each item in the array
  return data.filter((item) => {
    // For each item, the conditions are checked
    return !(item.longitude > -3.5 && item.longitude < 1.61);
  });
};

// Read the JSON file
fs.readFile("61.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    // Parse JSON data
    const jsonData = JSON.parse(data);

    // Ensure the data is an array
    if (Array.isArray(jsonData)) {
      // Filter the data (this is where the looping happens)
      const filteredData = filterData(jsonData);

      // Write filtered data to a new file
      fs.writeFile("61d.json", JSON.stringify(filteredData, null, 2), (err) => {
        if (err) {
          console.error("Error writing the file:", err);
        } else {
          console.log("Filtered data saved to 50d.json");
        }
      });
    } else {
      console.error("The JSON data is not an array.");
    }
  } catch (err) {
    console.error("Error parsing JSON data:", err);
  }
});
