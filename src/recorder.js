import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {AudioRecorderPlayer} from 'react-native-audio-recorder-player';

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');

  const audioRecorderPlayer = new AudioRecorderPlayer();

  useEffect(() => {
    // Initialize the audio recorder/player
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
          audioRecorderPlayer.setSubscriptionDuration(0.09);
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };
  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      setIsRecording(true);
      console.log(result);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      console.log(result);
      setAudioPath(result);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const startPlaying = async () => {
    try {
      const result = await audioRecorderPlayer.startPlayer(audioPath);
      console.log(result);
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  const stopPlaying = async () => {
    try {
      const result = await audioRecorderPlayer.stopPlayer();
      console.log(result);
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
        <Text>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>

      {audioPath !== '' && (
        <>
          <TouchableOpacity onPress={startPlaying}>
            <Text>Start Playing</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={stopPlaying}>
            <Text>Stop Playing</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Recorder;
