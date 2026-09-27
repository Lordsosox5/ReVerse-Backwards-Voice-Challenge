import { Platform } from 'react-native';

type AudioApiModule = typeof import('react-native-audio-api');

/**
 * Decodes a local recording, reverses every PCM frame per channel, and plays
 * the result through the native Audio API.
 *
 * The require is intentionally inside the function: Expo Go does not bundle
 * this custom native module, while Expo Launch/development builds do.
 */
export async function playReversedRecording(uri: string): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const audioApi = require('react-native-audio-api') as AudioApiModule;
    const decoded = await audioApi.decodeAudioData(uri);
    const reversed = new audioApi.AudioBuffer({
      numberOfChannels: decoded.numberOfChannels,
      length: decoded.length,
      sampleRate: decoded.sampleRate,
    });

    for (let channel = 0; channel < decoded.numberOfChannels; channel += 1) {
      const samples = decoded.getChannelData(channel);
      const reversedSamples = new Float32Array(samples.length);
      for (let index = 0; index < samples.length; index += 1) {
        reversedSamples[index] = samples[samples.length - index - 1];
      }
      reversed.copyToChannel(reversedSamples, channel);
    }

    const context = new audioApi.AudioContext({ sampleRate: decoded.sampleRate });
    const source = context.createBufferSource();
    source.buffer = reversed;
    source.connect(context.destination);
    source.onEnded = () => {
      void context.close();
    };
    source.start();
    return true;
  } catch {
    return false;
  }
}