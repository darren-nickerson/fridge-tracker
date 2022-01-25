import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { Camera } from 'expo-camera';
// import { API_KEY } from 'react-native-dotenv';
// console.log('API_KEY: ', API_KEY);

export default function App() {
  /* -------------------------------------------------------------------------- */
  /*                                  UseState                                  */
  /* -------------------------------------------------------------------------- */

  const [hasPermission, setHasPermission] = useState(null);
  const [camType, setCamType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  //   const [useCamera, setUseCamera] = useState(false);
  const cameraRef = useRef(null);

  /* -------------------------------------------------------------------------- */
  /*                                  Clarifai                                  */
  /* -------------------------------------------------------------------------- */

  function predict(photo) {
    const { ClarifaiStub } = require("clarifai-nodejs-grpc");
    const grpc = require("@grpc/grpc-js");
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", `Key 68acf5c2a23c4765b9dac7e1ed6c93cf`);

    return new Promise((resolve, reject) => {
      stub.PostModelOutputs(
        {
          model_id: "bd367be194cf45149e75f01d59f77ba7",
          inputs: [
            {
              data: {
                image: {
                  url: photo,
                },
              },
            },
          ],
        },
        metadata,
        (err, response) => {
          if (err) {
            return reject(`ERROR: ${err}`);
          }

          resolve(JSON.stringify(response.outputs[0].data.concepts));
        }
      );
    });
  }

  async function main(photo) {
    const response = await predict(photo);
    console.log(JSON.parse(response));
  }

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
      backgroundColor: "transparent",
      flexDirection: "row",
      margin: 20,
    },
    button: {
      flex: 0.1,
      alignSelf: "flex-end",
      alignItems: "center",
    },
    text: {
      fontSize: 18,
      color: "white",
    },
    pictureContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 40,
    },
    image: {
      width: "80%",
      height: "30%",
      borderRadius: 40,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                  Functions/UseEffect                       */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync(null);
      setImage(photo.uri);
<<<<<<< HEAD
      // console.log(photo.uri);
=======
      main(photo.uri);
      console.log(photo.uri);
>>>>>>> 9a9c091459d609dc27146e64d35c1ab023bff9ee
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
