const fs = require("fs");

const ips = fs.readFileSync("../IPs.txt", "utf8").trim().split(" ");
const central = "http://" + ips[0] + ":8080";
const europe = "http://" + ips[1] + ":8080";

async function main() {
  let missing = 0;
  const runId = Date.now();

  for (let i = 0; i < 100; i++) {
    const name = "test_" + runId + "_" + i;

    await fetch(central + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name }),
    });

    const res = await fetch(europe + "/list");
    const data = await res.json();

    if (!data.users.includes(name)) {
      missing++;
    }
  }

  console.log("missing right after register: " + missing + " / 100");
}

main();