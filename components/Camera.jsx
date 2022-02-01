import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
} from 'react-native';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as Clarifai from 'clarifai';
import { useIsFocused } from '@react-navigation/native';
import { CLARIFAI_API_KEY } from 'react-native-dotenv';
import { barcodeContext } from '../context';

export default function App({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scanned, setScanned] = useState(false);
  const { setBarcodeData } = useContext(barcodeContext);
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
        newPredictions.outputs[0].data.concepts
          .map((obj) => obj.name)
          .slice(0, 3),
      );
      setIsLoading(false);
    } catch (error) {
      console.log('Exception Error: ', error);
    }
  };
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    fetch(`https://en.openfoodfacts.org/api/v0/product/${data}`)
      .then((response) => response.json())
      .then((json) => {
        setBarcodeData(json.product.product_name_en);

        Linking.openURL(
          `exp://${
            Constants.manifest.hostUri.split(':')[0]
          }:19000/--/fridge/add`,
        );
      })
      .catch(() => {
        alert('item not found!');
      });
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setImage(photo.uri);
      clarifaiDetectObjectsAsync(photo.base64);
    }
  };
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
          {isFocused && (
            <Camera
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              ref={cameraRef}
              style={styles.camera}
              type={Camera.Constants.Type.back}
            />
          )}

          {scanned && (
            <Button
              style={styles.button}
              color="#841584"
              title="Scan Again"
              onPress={() => setScanned(false)}
            />
          )}
          <View style={styles.buttonContainer}>
            <Button
              title="Take Picture"
              onPress={() => {
                takePicture();
              }}
            />
            <Button
              title="X"
              style={styles.button}
              onPress={() => {
                setImage(null);
                navigation.navigate('Fridge List');
              }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <Image source={{ uri: image }} style={styles.camera} />
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            predictions.map((item) => {
              return (
                <Button
                  title={item}
                  key={item}
                  style={styles.button}
                  onPress={() => {
                    setImage(null);
                    setBarcodeData(item);
                    setPredictions([]);
                    setIsLoading(true);
                    Linking.openURL(
                      `exp://${
                        Constants.manifest.hostUri.split(':')[0]
                      }:19000/--/fridge/add`,
                    );
                  }}
                />
              );
            })
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="ReTake"
              style={styles.button}
              onPress={() => {
                setImage(null);
                setIsLoading(true);
              }}
            />
            <Button
              title="Add manually"
              style={styles.button}
              onPress={() => {
                setImage(null);
                Linking.openURL(
                  `exp://${
                    Constants.manifest.hostUri.split(':')[0]
                  }:19000/--/fridge/add`,
                );
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
