---
name: Native audio reversal
description: Local M4A waveform reversal uses a native audio graph and needs a custom Expo build.
---

True on-device reversal requires decoding the M4A into PCM, reversing samples per channel, and playing a new native audio buffer; Expo Go cannot load the custom native processor.

**Why:** Reversing compressed file bytes is invalid audio, and Expo's standard playback APIs do not expose decoded samples.

**How to apply:** Keep the native processor behind a runtime-safe helper with a speech fallback for web/Expo Go previews; Expo Launch or a development build is required for real waveform replay.