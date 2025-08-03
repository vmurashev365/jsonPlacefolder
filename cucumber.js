module.exports = {
  default: [
    'features/**/*.feature',
    '--require-module ts-node/register',
    '--require src/hooks/**/*.ts',
    '--require src/steps/**/*.ts',
    '--format progress-bar',
    '--format json:reports/cucumber-report.json',
    '--format html:reports/cucumber-report.html',
    '--format @cucumber/pretty-formatter',
    '--parallel 2',
    '--retry 1',
    '--retry-tag-filter "not @no-retry"',
    '--fail-fast',
    '--strict',
    '--exit'
  ].join(' '),
  
  smoke: [
    'features/**/*.feature',
    '--require-module ts-node/register',
    '--require src/hooks/**/*.ts',
    '--require src/steps/**/*.ts',
    '--tags "@smoke"',
    '--format progress-bar',
    '--format json:reports/smoke-report.json',
    '--format html:reports/smoke-report.html',
    '--parallel 1',
    '--retry 0',
    '--fail-fast',
    '--exit'
  ].join(' '),
  
  ci: [
    'features/**/*.feature',
    '--require-module ts-node/register',
    '--require src/hooks/**/*.ts',
    '--require src/steps/**/*.ts',
    '--tags "not @skip and not @manual"',
    '--format progress-bar',
    '--format json:reports/ci-report.json',
    '--format html:reports/ci-report.html',
    '--parallel 3',
    '--retry 2',
    '--exit'
  ].join(' '),
  
  verbose: [
    'features/**/*.feature',
    '--require-module ts-node/register',
    '--require src/hooks/**/*.ts',
    '--require src/steps/**/*.ts',
    '--format @cucumber/pretty-formatter',
    '--format json:reports/verbose-report.json',
    '--parallel 1',
    '--retry 0',
    '--exit'
  ].join(' '),
  
  debug: [
    'features/**/*.feature',
    '--require-module ts-node/register',
    '--require src/hooks/**/*.ts',
    '--require src/steps/**/*.ts',
    '--format @cucumber/pretty-formatter',
    '--format json:reports/debug-report.json',
    '--parallel 1',
    '--retry 0',
    '--exit'
  ].join(' ')
};
