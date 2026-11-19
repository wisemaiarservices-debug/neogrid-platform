import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const shell = readFileSync(new URL('../src/components/AppShell.tsx', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../../../README.md', import.meta.url), 'utf8');

test('NeoGrid shell persistently labels deterministic scenario fixtures', () => {
  assert.match(shell, /DEMO SCENARIO/);
  assert.match(shell, /Deterministic sample data only/);
  assert.match(shell, /not live SCADA, grid, battery or site telemetry/);
  assert.match(shell, /API reachable · response only/);
  assert.match(shell, /Synthetic fixtures/);
  assert.doesNotMatch(shell, /Live \/ SolarHub Energy Site/);
  assert.doesNotMatch(shell, /5s aggregate/);
});

test('NeoGrid views avoid unsupported live telemetry and measured-impact claims', () => {
  assert.match(app, /Illustrative frequency, transmission-flow and substation scenarios/);
  assert.match(app, /not independently measured/);
  assert.match(app, /Sample online fixture/);
  assert.match(app, /Sample degraded fixture/);
  assert.match(app, /Sample offline fixture/);
  assert.match(app, /approval workflow not connected/);
  assert.doesNotMatch(app, /Live frequency, transmission flows/);
  assert.doesNotMatch(app, /Measured renewable share/);
  assert.doesNotMatch(app, /Pilot-ready energy report/);
});

test('NeoGrid documentation distinguishes API reachability from product integration', () => {
  assert.match(readme, /does not currently consume the returned dashboard payload/);
  assert.match(readme, /contract reference only/);
  assert.match(readme, /not live SCADA/);
});
