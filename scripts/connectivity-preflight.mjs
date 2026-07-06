import dns from "node:dns/promises";
import net from "node:net";

const required = ["DATABASE_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
const missing = required.filter((name) => !process.env[name]);

function parseDatabaseTarget() {
  try {
    const url = new URL(process.env.DATABASE_URL);
    return { host: url.hostname, port: Number(url.port || 5432) };
  } catch {
    return null;
  }
}

async function resolveHost(host) {
  try {
    const result = await dns.lookup(host, { all: true });
    return { ok: result.length > 0, addresses: result.map((item) => item.address) };
  } catch (error) {
    return { ok: false, code: error?.code ?? "UNKNOWN" };
  }
}

async function checkTcp(host, port, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const done = (result) => { socket.destroy(); resolve(result); };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => done({ ok: true }));
    socket.once("timeout", () => done({ ok: false, code: "ETIMEDOUT" }));
    socket.once("error", (error) => done({ ok: false, code: error.code ?? "UNKNOWN" }));
  });
}

const db = parseDatabaseTarget();
const googleDns = await resolveHost("accounts.google.com");
const databaseDns = db ? await resolveHost(db.host) : { ok: false, code: "INVALID_DATABASE_URL" };
const databaseTcp = db && databaseDns.ok ? await checkTcp(db.host, db.port) : { ok: false, code: "DNS_FAILED" };

const report = {
  environment: { ok: missing.length === 0, missing },
  googleDns,
  database: db ? { host: db.host, port: db.port, dns: databaseDns, tcp: databaseTcp } : null,
};

console.log(JSON.stringify(report, null, 2));

if (!report.environment.ok || !googleDns.ok || !databaseDns.ok || !databaseTcp.ok) {
  process.exitCode = 1;
}
