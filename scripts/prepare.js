import { execSync } from 'node:child_process';

const run = (cmd) => {
	try {
		execSync(cmd, { stdio: 'inherit' });
	} catch {
		console.log(`[prepare] "${cmd}" failed, continuing`);
	}
};

run('svelte-kit sync');

if (!process.env.VERCEL && !process.env.CI) {
	run('playwright install');
	run('husky');
}
