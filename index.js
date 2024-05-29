const axios = require("axios");
const fs = require("fs").promises;

const fetchData = async (latitude, longitude) => {
  const url = "https://api.plugshare.com/v3/locations/region";
  const params = {
    access: 1,
    count: 10000,
    latitude: latitude,
    longitude: longitude,
    minimal: 0,
    outlets: Array.from({ length: 31 }, (_, i) => ({ connector: i, power: 0 })),
    spanLat: 0.2,
    spanLng: 0.5,
  };
  const headers = {
    Accept: "*/*",
    Authorization: "Basic d2ViX3YyOkVOanNuUE54NHhXeHVkODU=",
    "Cognito-Authorization":
      "eyJraWQiOiJ4RmIzSVZuTXhYZEhUaWNTN1NJeVNGc3BHOUsydVZ2NUVNT2U4NkQxeHhBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSS1xM1lNZXk1OVBjM1cwX0dqaGdudyIsInN1YiI6ImQ0MmE5YjI5LWYxNjgtNGUxMi05NTRkLTE3M2QxMDBkZmE4MSIsImN1c3RvbTpwbHVnc2hhcmVfaWQiOiI1MjU1OTAyIiwiY29nbml0bzpncm91cHMiOlsidXMtZWFzdC0xX293ZVE3WG1HZl9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX293ZVE3WG1HZiIsImNvZ25pdG86dXNlcm5hbWUiOiJnb29nbGVfMTEzMzgxMTAxNTgxNjY2NjM1MDk1IiwiZ2l2ZW5fbmFtZSI6IkFCSEFZIiwicGljdHVyZSI6Imh0dHBzOlwvXC9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tXC9hXC9BQ2c4b2NKSHlSQ3l1T3lhVUxvMUNZcDRuZkpUN2lhVG42U2ZvR0IwS2tjX0FzWFo1THROZkE9czk2LWMiLCJhdWQiOiIydTBxaTNyMGVrYzNobnNsMnJzZzMxMWNpIiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoiMTEzMzgxMTAxNTgxNjY2NjM1MDk1IiwicHJvdmlkZXJOYW1lIjoiR29vZ2xlIiwicHJvdmlkZXJUeXBlIjoiR29vZ2xlIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTcxNjIyMjkyMjk2MiJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTYyMjI5MjcsIm5hbWUiOiJBQkhBWSBLdW1hciIsImV4cCI6MTcxNjIyNjUyOSwiaWF0IjoxNzE2MjIyOTI5LCJlbWFpbCI6ImFrbmcwNEBnbWFpbC5jb20ifQ.Ktl9pJPDky2ZGd0xPBpm8sM-UfHSLiyFCHgtnWlvOalTD0mpzo1jDrbXix-nDymZ_DFrf1YpnqpBOsp9kIw5EJiTP3ewG2h59cduyx2AT6orUvBvCnJGOLZk4O8iwrytp9aNPLMZ4ZlDIT-U5I7HfBS1I7F94h_9FF08aMHbGe_GQWK30QjN5JjuCIZSmOb5PLCZlq-uk_44kHla0GlxyYG0BYRBQk15UtTyZhkalPYe9uu_rQyk2V_5mZAVMNifWG6pG2XoPyNWJhnNXAD52L1tO_QGUxudx-82VOz44iK8IAME_6lm9VAiAS5gQl3yfKmN_fJdqK5tNiuhIcNuiQ",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  };

  try {
    const response = await axios.get(url, { params, headers });

    let existingData = [];
    try {
      const data = await fs.readFile(`${parseInt(latitude)}.json`, "utf-8");
      existingData = JSON.parse(data);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    existingData.push(...response.data);

    await fs.writeFile(`${parseInt(latitude)}.json`, JSON.stringify(existingData, null, 2));

    console.log(`Data saved for latitude: ${latitude}, longitude: ${longitude}`);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // rethrow the error to be caught in the run function
  }
};

const aaaa = [];
const run = async () => {
  try {
    let latitude = parseFloat(await fs.readFile("latitude.txt", "utf8"));
    let longitude = parseFloat(await fs.readFile("longitude.txt", "utf8"));

    await fetchData(latitude, longitude);

    longitude += 0.5;
    await fs.writeFile("longitude.txt", longitude.toString());

    console.log(`Updated longitude: ${longitude}`);
  } catch (error) {
    console.error("Error in run function:", error);
    aaaa.push(longitude);
    throw error; // rethrow the error to be caught in the start function
  }
};

const INTERVAL = 0;
const REQUESTS = 720;
const MAX_ERRORS = 2; // Maximum number of consecutive errors allowed

const start = async (requests) => {
  let latitude;
  let errorCount = 0;

  try {
    latitude = parseFloat(await fs.readFile("latitude.txt", "utf8"));
  } catch (e) {
    console.log("Error reading latitude file:", e);
    return; // exit if there is an error reading the latitude file
  }

  for (let j = 0; j < 50; j++) {
    for (let i = 0; i < requests; i++) {
      try {
        await run();
        errorCount = 0; // reset error count on successful request
        await new Promise((resolve) => setTimeout(resolve, INTERVAL));
      } catch (error) {
        errorCount++;
        console.error(`Consecutive errors: ${errorCount}`);
        if (errorCount >= MAX_ERRORS) {
          console.error("Maximum consecutive errors reached. Stopping execution.");
          return;
        }
      }
    }
    latitude += 0.2;
    await fs.writeFile("latitude.txt", latitude.toString());

    longitude = -180;
    await fs.writeFile("longitude.txt", longitude.toString());
  }
};

// Start the loop with the specified number of requests
start(REQUESTS);
