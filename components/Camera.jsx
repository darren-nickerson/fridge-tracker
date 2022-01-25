import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
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
  /*                                  UseState                                  */
  /* -------------------------------------------------------------------------- */

  const [hasPermission, setHasPermission] = useState(null);
  const [camType, setCamType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  //   const [useCamera, setUseCamera] = useState(false);
  const cameraRef = useRef(null);

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
      const photo = await cameraRef.current.takePictureAsync(null);
      setImage(photo.uri);
      console.log(photo.uri);
    }
  };
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
              title='Flip'
              style={styles.button}
              onPress={() => {
                setCamType(
                  camType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            />
            <Button
              title='Take Picture'
              onPress={() => {
                takePicture();
              }}
            />
            <Button
              title='Cancel'
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
              title='ReTake'
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
