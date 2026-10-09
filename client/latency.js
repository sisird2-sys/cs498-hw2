const fs = require("fs");

const ips = fs.readFileSync("../IPs.txt", "utf8").trim().split(" ");
const servers = [
  { name: "us-central1", url: "http://" + ips[0] + ":8080" },
  { name: "europe-west1", url: "http://" + ips[1] + ":8080" },
];

async function timeIt(url, opts) {
  const start = performance.now();
  const res = await fetch(url, opts);
  await res.text();
  return performance.now() - start;
}

function average(arr) {
  let sum = 0;
  for (const t of arr) sum += t;
  return sum / arr.length;
}

async function main() {
  for (const s of servers) {
    const regTimes = [];
    const listTimes = [];

    for (let i = 0; i < 10; i++) {
      const t = await timeIt(s.url + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "lat_" + s.name + "_" + Date.now() + "_" + i }),
      });
      regTimes.push(t);
    }

    for (let i = 0; i < 10; i++) {
      listTimes.push(await timeIt(s.url + "/list"));
    }

    console.log("\n" + s.name);
    console.log("register times:", regTimes.map(t => t.toFixed(1)).join(", "));
    console.log("list times:", listTimes.map(t => t.toFixed(1)).join(", "));
    console.log("avg register: " + average(regTimes).toFixed(2) + " ms");
    console.log("avg list: " + average(listTimes).toFixed(2) + " ms");
  }
}

main();