# Scenario Documentation Sync Guide

This guide explains how to update scenario markdown documentation files to match their corresponding TypeScript configuration files.

## Overview

Each scenario has two related files:
- **TypeScript config** (source of truth): `signal-range/src/campaigns/{campaign}/scenario{N}.ts`
- **Markdown documentation**: `signal-range-docs/src/content/docs/scenarios/scenario-{N}.mdx`

The TypeScript file defines the actual scenario behavior. The markdown file provides pre-mission background reading for users.

## Source Files to Reference

When updating a scenario's documentation, gather information from these files:

| File | Contains |
|------|----------|
| `scenario{N}.ts` | Objectives, phases, dialog clips, duration, difficulty |
| `ground-stations.ts` | Equipment values (GPSDO, LNB, HPA, BUC, antenna, spectrum analyzer) |
| `satellites.ts` | Satellite parameters, beacon frequencies, transponder configs |
| `constants.ts` | Frequency band definitions (C-band, Ku-band, etc.) |

## Key Areas to Verify

### 1. Metadata
```
Duration        → scenarioData.duration
Difficulty      → scenarioData.difficulty
Mission Type    → scenarioData.missionType
```

### 2. Phases/Objectives
The `objectives` array in the TypeScript file defines the actual phases. Each objective has:
- `id` - Phase identifier
- `title` - Phase name
- `description` - What the user does
- `conditions.params.question` - The question asked
- `conditions.params.correctIndex` - Which answer is correct
- `conditions.params.explanation` - Why that answer is correct

Map these to the markdown phases. The number of phases in the documentation must match the number of objectives in TypeScript.

### 3. Equipment Values

Check `ground-stations.ts` for the specific ground station used in the scenario:

| Equipment | Properties to Check |
|-----------|---------------------|
| GPSDO | `satelliteCount`, `frequencyAccuracy`, `temperature`, `active10MHzOutputs`, `lockDuration` |
| LNB | `loFrequency`, `gain`, `noiseTemperature`, `temperature` |
| HPA | `outputPower`, `backOff`, `isHpaEnabled` |
| BUC | `loFrequency`, `gain` |
| Antenna | `azimuth`, `elevation`, `polarization`, `trackingMode` |
| Spectrum Analyzer | `centerFrequency`, `span`, `rbw`, `referenceLevel` |
| Receiver | `modulation`, `fec` |

### 4. Satellite/Beacon Frequencies

Check `satellites.ts` for:
- Beacon RF frequency (in `transponderConfigs[].beacon.frequency`)
- Calculate IF frequency: `beacon_RF - LNB_LO_frequency`

### 5. Frequency Bands

Verify C-band (or other band) ranges against `constants.ts`:
```typescript
c: {
  downLow: 3400e6,   // 3.4 GHz
  downHigh: 4200e6,  // 4.2 GHz
  upLow: 5850e6,     // 5.85 GHz
  upHigh: 6725e6,    // 6.725 GHz
}
```

## Documentation Rules

### What to Include
- Background concepts and theory
- Equipment descriptions and purpose
- What each indicator means
- What "normal" looks like
- Learning objectives

### What NOT to Include
The documentation is a **pre-mission read-ahead**. Do not include:
- Forward references to future scenarios ("Tomorrow you'll...")
- "Next Scenario" sections
- Content about what happens after the lesson ends
- Spoilers from dialog that plays during the scenario
- Answers to the scenario questions (let users discover these)

## Step-by-Step Process

1. **Read the TypeScript scenario file** - Note the objectives array, duration, and mission type

2. **Read supporting config files** - Get equipment values from ground-stations.ts and satellite parameters from satellites.ts

3. **Compare with markdown** - Identify discrepancies:
   - Wrong values (frequencies, temperatures, etc.)
   - Missing phases
   - Extra phases not in TypeScript
   - Incorrect phase order

4. **Update metadata** - Fix duration, difficulty, mission type

5. **Update equipment values** - Fix all numeric values to match configs

6. **Restructure phases** - Add missing phases, remove extras, fix order

7. **Remove forward-looking content** - Delete references to future lessons

8. **Verify frequency calculations** - Ensure IF = RF - LO math is correct

## Common Discrepancies

| Issue | Example |
|-------|---------|
| Wrong tracking mode | "Step-track" vs "Program-track" |
| Wrong frequencies | RF frequency shown instead of IF |
| Wrong LO frequency | 5150 MHz vs 5250 MHz |
| Missing phases | 6 phases in docs, 10 in TypeScript |
| Wrong modulation | 16APSK vs QPSK |
| Forward references | "Tomorrow's Session" sections |

## Example: Calculating IF Frequency

Given:
- Beacon RF: 4175.5 MHz (from satellites.ts)
- LNB LO: 5250 MHz (from ground-stations.ts)

IF = RF - LO = 4175.5 - 5250 = -1074.5 MHz

Since IF is typically expressed as positive: **1074.5 MHz IF**

(Note: The sign depends on whether LO is above or below RF. For C-band with high-side LO, IF = LO - RF)

## Checklist

Before considering the documentation complete:

- [ ] Duration matches TypeScript
- [ ] Mission type matches TypeScript
- [ ] Number of phases matches objectives array
- [ ] Phase titles match objective titles
- [ ] All equipment values match ground-stations.ts
- [ ] Beacon frequency matches satellites.ts
- [ ] IF frequency is correctly calculated
- [ ] Frequency bands match constants.ts
- [ ] No forward-looking content ("tomorrow", "next scenario")
- [ ] No spoilers from scenario dialog
