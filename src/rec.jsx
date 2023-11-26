import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

const CustomButton = ({title, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 40,
        paddingVertical: 20,
        backgroundColor: 'grey',
      }}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const Rec = () => {
  const path = Platform.select({
    ios: undefined,
    android: undefined,
  });

  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');

  const onStartRecord = async () => {
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
          console.log('permissions granted');
        } else {
          console.log('All required permissions not granted');

          return;
        }
      } catch (err) {
        console.warn(err);

        return;
      }
    }

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    console.log('audioSet', audioSet);

    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);

    audioRecorderPlayer.addRecordBackListener(e => {
      // console.log('record-back', e);
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
    console.log(`uri: ${uri}`);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);

    console.log(result);
  };

  const onPlay = async () => {
    console.log('onStartPlay', this.path);

    try {
      const msg = await audioRecorderPlayer.startPlayer(path);

      //? Default path
      // const msg = await this.audioRecorderPlayer.startPlayer();
      const volume = await audioRecorderPlayer.setVolume(1.0);
      console.log(`path: ${msg}`, `volume: ${volume}`);

      audioRecorderPlayer.addPlayBackListener(e => {
        console.log('playBackListener', e);
        // this.setState({
        //   currentPositionSec: e.currentPosition,
        //   currentDurationSec: e.duration,
        //   playTime: this.audioRecorderPlayer.mmssss(
        //     Math.floor(e.currentPosition),
        //   ),
        //   duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
        // });
      });
    } catch (err) {
      console.log('startPlayer error', err);
    }
  };

  const onStop = () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  return (
    <View>
      <CustomButton title={'Start Recording'} onPress={onStartRecord} />
      <CustomButton title={'Stop Recording'} onPress={onStopRecord} />
      <Text>{recordTime}</Text>
      <CustomButton title={'Play Recording'} onPress={onPlay} />
      <CustomButton title={'Stop Recording'} onPress={onStop} />
    </View>
  );
};

export default Rec;

const styles = StyleSheet.create({});
