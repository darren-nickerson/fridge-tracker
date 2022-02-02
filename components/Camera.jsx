import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as Clarifai from 'clarifai';
import { useIsFocused } from '@react-navigation/native';
import { CLARIFAI_API_KEY } from 'react-native-dotenv';
import { barcodeContext } from '../context';
import { FontAwesome } from '@expo/vector-icons';

export default function App({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scanned, setScanned] = useState(false);
  const { setBarcodeData } = useContext(barcodeContext);

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
            >
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  flexDirection: 'row',
                  flex: 1,
                  width: '100%',
                  padding: 20,
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    alignSelf: 'center',
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: '#fff',
                    }}
                    onPress={() => {
                      takePicture();
                    }}
                  />
                </View>
              </View>
              <View style={styles.buttonContainer}>
                {scanned && (
                  <Button
                    style={styles.button}
                    color="blue"
                    title="Scan Again"
                    onPress={() => setScanned(false)}
                  />
                )}
                <FontAwesome
                  name="close"
                  size={45}
                  color="white"
                  style={styles.cancelButton}
                  onPress={() => {
                    setImage(null);
                    navigation.navigate('Fridge List');
                  }}
                />
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <View style={styles.pictureContainer}>
          {isLoading ? (
            <>
              <ImageBackground
                source={{ uri: image }}
                style={styles.cameraDisplay}
              />
              <View style={styles.loading}>
                <View style={styles.retakeAddManuallyContainer}>
                  <Pressable
                    style={styles.reTakeButton}
                    onPress={() => {
                      setImage(null);
                      setIsLoading(true);
                    }}
                  >
                    <Text style={styles.reTakeWord}>ReTake</Text>
                  </Pressable>
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
                <View style={styles.loadingWheel}>
                  <ActivityIndicator size={'large'} color="#000000" />
                  <Text style={styles.text}>Figuring Out Item...</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <ImageBackground
                source={{ uri: image }}
                style={styles.cameraPictureResults}
              />
              <View style={styles.predictionContainer}>
                {predictions.map((item) => {
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
                })}
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 10,
  },

  pictureContainer: {
    height: '95%',
    backgroundColor: 'blue',
  },

  cameraDisplay: {
    height: '100%',
    width: '100%',
  },

  buttonContainer: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    marginTop: 50,
    height: 40,
    marginRight: 20,
  },

  retakeAddManuallyContainer: {
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginTop: 50,
    height: 40,
    margin: 20,
  },

  predictionContainer: {
    flex: 1,
    backgroundColor: 'blue',
    flexDirection: 'column',
    marginTop: 20,
  },

  cancelButton: {
    alignSelf: 'flex-end',
  },

  button: {},
  text: {
    fontSize: 30,
    color: 'white',
    fontWeight: '200',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pictureContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },

  loading: {
    display: 'flex',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  loadingWheel: {
    flexDirection: 'column',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },

  reTakeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },

  reTakeWord: {
    color: 'white',
  },

  cameraPictureResults: {
    height: '50%',
    width: '100%',
  },
});
