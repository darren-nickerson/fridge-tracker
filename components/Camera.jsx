import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { Camera } from 'expo-camera';
import * as Clarifai from 'clarifai';
import { CLARIFAI_API_KEY } from 'react-native-dotenv';

export default function App() {
  /* -------------------------------------------------------------------------- */
  /*                                  UseState                                  */
  /* -------------------------------------------------------------------------- */

  const [hasPermission, setHasPermission] = useState(null);
  const [camType, setCamType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const cameraRef = useRef(null);

  /* -------------------------------------------------------------------------- */
  /*                                  Styles                                    */
  /* -------------------------------------------------------------------------- */

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
    },
    button: {
      flex: 0.1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: 'white',
    },
    pictureContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 40,
    },
    image: {
      width: '80%',
      height: '30%',
      borderRadius: 40,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                  Clarifai                                  */
  /* -------------------------------------------------------------------------- */

  const clarifaiApp = new Clarifai.App({
    apiKey: CLARIFAI_API_KEY,
  });
  process.nextTick = setImmediate;

  const clarifaiDetectObjectsAsync = async (source) => {
    try {
      const newPredictions = await clarifaiApp.models.predict(
        { id: Clarifai.FOOD_MODEL },
        { base64: source },
        { maxConcepts: 10, minValue: 0.4 },
      );
      setPredictions(
        newPredictions.outputs[0].data.concepts.map((obj) => obj.name),
      );
    } catch (error) {
      console.log('Exception Error: ', error);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  Functions/UseEffect                       */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setImage(photo.uri);
      clarifaiDetectObjectsAsync(photo.base64);
    }
  };
  console.log(predictions);
  /* -------------------------------------------------------------------------- */
  /*                                  Component                                  */
  /* -------------------------------------------------------------------------- */

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {image === null ? (
        <View style={styles.container}>
          <Camera ref={cameraRef} style={styles.camera} type={camType} />
          <View style={styles.buttonContainer}>
            <Button
              title="Flip"
              style={styles.button}
              onPress={() => {
                setCamType(
                  camType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
                );
              }}
            />
            <Button
              title="Take Picture"
              onPress={() => {
                takePicture();
              }}
            />
            <Button
              title="Cancel"
              style={styles.button}
              onPress={() => {
                setImage(null);
              }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <Image source={{ uri: image }} style={styles.camera} />
          <View style={styles.buttonContainer}>
            <Button
              title="ReTake"
              style={styles.button}
              onPress={() => {
                setImage(null);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
