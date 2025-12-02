const { exec } = require('child_process');

function execP(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) return reject({ err, stdout, stderr });
      resolve({ stdout, stderr });
    });
  });
}

async function freePort(port) {
  const platform = process.platform;
  console.log(`Checking port ${port} on platform ${platform}...`);

  if (platform === 'win32') {
    try {
      const { stdout } = await execP(`netstat -ano | findstr :${port}`);
      if (!stdout.trim()) {
        console.log(`Port ${port} is free.`);
        return;
      }
      const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0') pids.add(pid);
      }
      for (const pid of pids) {
        console.log(`Killing PID ${pid} occupying port ${port}...`);
        try {
          await execP(`taskkill /PID ${pid} /F`);
          console.log(`PID ${pid} killed.`);
        } catch (e) {
          console.warn(`Failed to kill PID ${pid}:`, e.err ? e.err.message : e);
        }
      }
    } catch (e) {
      // no matching lines -> port free
      if (e.stdout && !e.stdout.trim()) {
        console.log(`Port ${port} is free.`);
        return;
      }
      console.warn('Error while checking port:', e.err ? e.err.message : e);
    }
  } else {
    // unix-like
    try {
      const { stdout } = await execP(`lsof -i :${port} -t || true`);
      const pids = stdout.trim().split(/\s+/).filter(Boolean);
      if (!pids.length) {
        console.log(`Port ${port} is free.`);
        return;
      }
      for (const pid of pids) {
        console.log(`Killing PID ${pid} occupying port ${port}...`);
        try {
          await execP(`kill -9 ${pid}`);
          console.log(`PID ${pid} killed.`);
        } catch (e) {
          console.warn(`Failed to kill PID ${pid}:`, e.err ? e.err.message : e);
        }
      }
    } catch (e) {
      console.warn('Error while checking port:', e.err ? e.err.message : e);
    }
  }
}

const port = process.argv[2] || process.env.PORT || '3000';

freePort(port).then(() => process.exit(0)).catch((err) => {
  console.error('Failed to ensure port free:', err);
  process.exit(1);
});
