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
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { barcodeContext } from '../context';

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
                  <Pressable
                    style={styles.scanAgainButton}
                    color="blue"
                    onPress={() => setScanned(false)}
                  >
                    <Ionicons name="barcode-sharp" size={40} color="white" />
                    <Text style={styles.barcodeText}>Scan Again</Text>
                  </Pressable>
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
                    <Text style={styles.reTakeWord}> 📸 {''} Retake Photo</Text>
                  </Pressable>
                  <Pressable
                    style={styles.addManuallyButton}
                    onPress={() => {
                      setImage(null);
                      Linking.openURL(
                        `exp://${
                          Constants.manifest.hostUri.split(':')[0]
                        }:19000/--/fridge/add`,
                      );
                    }}
                  >
                    <Text style={styles.addManuallyWord}>
                      ✏️ {''} Add Manually
                    </Text>
                  </Pressable>
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
              >
                <View style={styles.retakeAddManuallyContainerAfterPicture}>
                  <Pressable
                    style={styles.reTakeButton}
                    onPress={() => {
                      setImage(null);
                      setIsLoading(true);
                    }}
                  >
                    <Text style={styles.reTakeWord}> 📸 {''} Retake Photo</Text>
                  </Pressable>
                  <Pressable
                    style={styles.addManuallyButton}
                    onPress={() => {
                      setImage(null);
                      Linking.openURL(
                        `exp://${
                          Constants.manifest.hostUri.split(':')[0]
                        }:19000/--/fridge/add`,
                      );
                    }}
                  >
                    <Text style={styles.addManuallyWord}>
                      ✏️ {''} Add Manually
                    </Text>
                  </Pressable>
                </View>
              </ImageBackground>
              <Text style={styles.optionsTitle}> SELECT YOUR ITEM</Text>
              <View style={styles.predictionContainer}>
                {predictions.map((item) => {
                  return (
                    <Pressable
                      title={item}
                      key={item}
                      style={styles.options}
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
                    >
                      <Text style={styles.optionsText}>{item}</Text>
                    </Pressable>
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
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    flexDirection: 'row',
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
    top: 500,
  },

  predictionContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
  },

  cancelButton: {
    top: 0,
    right: 0,
    position: 'absolute',
  },

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
    top: 300,
    bottom: 0,
  },

  reTakeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 7,
    elevation: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 170,
  },

  scanAgainButton: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderRadius: 7,
    elevation: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 100,
    top: 0,
    left: 20,
    position: 'absolute',
  },

  addManuallyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 7,
    elevation: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 170,
  },

  reTakeWord: {
    color: 'white',
    fontWeight: 'bold',
  },

  addManuallyWord: {
    color: 'white',
    fontWeight: 'bold',
  },

  barcodeText: {
    color: 'white',
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },

  cameraPictureResults: {
    height: 500,
    width: '100%',
  },
  options: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 7,
    elevation: 3,
    backgroundColor: 'rgb(53, 86, 230)',
    width: 170,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  optionsText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 26,
    marginTop: 15,
    marginBottom: 15,
  },
  retakeAddManuallyContainerAfterPicture: {
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginTop: 50,
    height: 40,
    margin: 20,
    top: 370,
  },
});
