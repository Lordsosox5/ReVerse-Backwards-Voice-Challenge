---
name: Expo audio compatibility
description: Native audio implementations should account for Expo AV deprecation in newer SDKs.
---

Expo SDK 57 still runs `expo-av`, but the runtime warns that Expo AV is deprecated and recommends `expo-audio` / `expo-video`.

**Why:** A future audio-focused pass should migrate recording and playback to the supported packages before relying on newer Expo SDK behavior.

**How to apply:** Keep the current recording flow isolated behind the voice-round component so an audio-package migration does not affect the game screens.