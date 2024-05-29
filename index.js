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
      "eyJraWQiOiJ4RmIzSVZuTXhYZEhUaWNTN1NJeVNGc3BHOUsydVZ2NUVNT2U4NkQxeHhBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoid3FHcGZYSFRuT2VpTThpbERFUVlOdyIsInN1YiI6ImI0ODE0NDRkLTVhOGItNGQ0Ni1hZmE5LTc1NmNmYTk2ZDhlMyIsImN1c3RvbTpwbHVnc2hhcmVfaWQiOiI1MjI5OTQ3IiwiY29nbml0bzpncm91cHMiOlsidXMtZWFzdC0xX293ZVE3WG1HZl9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX293ZVE3WG1HZiIsImNvZ25pdG86dXNlcm5hbWUiOiJnb29nbGVfMTExNzc4ODIwMzU4Mzc4MTA2MDk3IiwiZ2l2ZW5fbmFtZSI6IlByYWRlZXAga3VtYXIiLCJwaWN0dXJlIjoiaHR0cHM6XC9cL2xoMy5nb29nbGV1c2VyY29udGVudC5jb21cL2FcL0FDZzhvY0pHbDRETC04RWVvcHV3OXd4M1Z5TkNwQUV5QWs5Z3l2cG5udFBFZ0dtdjlCRWROT21JPXM5Ni1jIiwiYXVkIjoiMnUwcWkzcjBla2MzaG5zbDJyc2czMTFjaSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjExMTc3ODgyMDM1ODM3ODEwNjA5NyIsInByb3ZpZGVyTmFtZSI6Ikdvb2dsZSIsInByb3ZpZGVyVHlwZSI6Ikdvb2dsZSIsImlzc3VlciI6bnVsbCwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE3MTU3MzY2NjY5MTkifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzE2NjA0ODQ5LCJuYW1lIjoiUHJhZGVlcCBrdW1hciBNYXVyeWEiLCJleHAiOjE3MTY2MDg0NTEsImlhdCI6MTcxNjYwNDg1MSwiZW1haWwiOiJtcHJhZGVlcGt1bWFyNjk3QGdtYWlsLmNvbSJ9.mjhI0852zHNeW5Dfv7E0nJJnXVp2sSMxNF_NnCHlfAhTYykzaxaFQ_vatJaTcXH7svIk6yksAbkFWXmH63zLEDofKYPZPF7QiwpZ2cDTzp7FTH6n295WF38f7ntj02Mw4DHk0PKGYbsnSl4WtI4LYRkTB3IGb-LMC7qjfq263J1TSy-HsSTPK52KjpM_-98N1v2V-WjfoR__lYEOMg5bDrg4J0HyhUj6voikP5ructLu88BOquRrI5q0_JxeoPERrYk4dhqm4UpTRg8JK5Hs6YY4R8iOVmNhR7hDia7OXSD_VeFOyuPh1RPj21lFS4xCt-xDr5Z1ldOGqidlpvRN6w",
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
