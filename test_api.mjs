import fetch from "node-fetch";
async function run() {
  try {
    const res = await fetch("http://localhost:3000/api/agent-trend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goodUrl: "", badUrl: "" })
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", text);
  } catch(e) { console.error(e); }
}
run();
