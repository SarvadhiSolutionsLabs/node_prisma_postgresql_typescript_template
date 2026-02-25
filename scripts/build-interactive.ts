import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const askQuestion = (question: string, defaultValue?: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const q = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;

  return new Promise((resolve) => {
    rl.question(q, (answer) => {
      rl.close();
      if (!answer && defaultValue) {
        resolve(defaultValue);
      } else {
        resolve(answer.trim());
      }
    });
  });
};

const getCurrentBranch = (): string | null => {
  try {
    const result = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    return result || null;
  } catch {
    return null;
  }
};

const getCurrentCommit = (): string | null => {
  try {
    const result = execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    return result || null;
  } catch {
    return null;
  }
};

const normalizeEnvFlavor = (value: string): 'local' | 'dev' | 'staging' | 'production' => {
  const v = value.toLowerCase();
  if (v === 'local') return 'local';
  if (v === 'dev' || v === 'development') return 'dev';
  if (v === 'staging') return 'staging';
  if (v === 'prod' || v === 'production') return 'production';
  return 'local';
};

const main = async () => {
  const currentBranch = getCurrentBranch();
  const defaultBranch = currentBranch ?? 'unknown';

  const branch = await askQuestion('Which branch are you building for?', defaultBranch);

  const envAnswer = await askQuestion(
    'Which environment flavor? [local/dev/staging/production]',
    'local'
  );
  const flavor = normalizeEnvFlavor(envAnswer);

  const buildMessage = await askQuestion(
    'Enter a short build message/label (e.g. production, local test build)',
    `${flavor} build`
  );

  const isProdLike = flavor === 'staging' || flavor === 'production';
  const nodeEnv = isProdLike ? 'production' : 'development';

  const buildEnv = {
    ...process.env,
    APP_ENV: flavor,
    NODE_ENV: nodeEnv
  };

  const result = spawnSync('npm', ['run', 'build'], {
    stdio: 'inherit',
    env: buildEnv
  });

  if (result.status !== 0) {
    // eslint-disable-next-line no-console
    console.error('Build failed. See output above for details.');
    process.exit(result.status ?? 1);
  }

  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const buildInfo = {
    branch,
    flavor,
    nodeEnv,
    buildMessage,
    buildTime: new Date().toISOString(),
    commitHash: getCurrentCommit()
  };

  fs.writeFileSync(path.join(distDir, 'build-info.json'), JSON.stringify(buildInfo, null, 2), {
    encoding: 'utf-8'
  });

  // eslint-disable-next-line no-console
  console.log(
    `Build created for branch "${branch}", env "${flavor}", message "${buildMessage}". Metadata written to dist/build-info.json`
  );
};

void main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Interactive build script failed', error);
  process.exit(1);
});

