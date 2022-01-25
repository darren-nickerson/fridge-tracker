/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Icon,
  HStack,
  Center,
  Pressable,
} from 'native-base';

import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';

const TestComponent = ({ navigation }) => {
  const [selected, setSelected] = React.useState(1);
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="white" safeAreaTop>
        <Center flex={1} />
        <HStack
          bg="white"
          alignItems="center"
          safeAreaBottom
          borderWidth="1"
          shadow={6}
          borderColor="coolGray.200"
        >
          <Pressable
            opacity={selected === 0 ? 1 : 0.5}
            py="3"
            flex={1}
            onPress={() => {
              setSelected(0);
              navigation.navigate('FridgeList');
            }}
          >
            <Center>
              <Icon
                mb="1"
                as={
                  <MaterialCommunityIcons
                    name={selected === 0 ? 'fridge' : 'fridge-outline'}
                  />
                }
                color="coolGray.600"
                size="sm"
              />
              <Text color="coolGray.600" fontSize="12">
                Fridge
              </Text>
            </Center>
          </Pressable>
          <Pressable
            opacity={selected === 1 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => setSelected(1)}
          >
            <Center>
              <Icon
                mb="1"
                as={
                  <MaterialIcons
                    name={selected === 1 ? 'add-circle' : 'add-circle-outline'}
                  />
                }
                color="coolGray.600"
                size="sm"
              />
              <Text color="coolGray.600" fontSize="12">
                Add
              </Text>
            </Center>
          </Pressable>
          <Pressable
            opacity={selected === 2 ? 1 : 0.6}
            py="2"
            flex={1}
            onPress={() => setSelected(2)}
          >
            <Center>
              <Icon
                mb="1"
                as={
                  <Ionicons
                    name={selected === 2 ? 'camera' : 'camera-outline'}
                  />
                }
                color="coolGray.600"
                size="sm"
              />
              <Text color="coolGray.600" font="12">
                Camera
              </Text>
            </Center>
          </Pressable>
          <Pressable
            opacity={selected === 3 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => setSelected(3)}
          >
            <Center>
              <Icon
                mb="1"
                as={
                  <Ionicons
                    name={selected === 3 ? 'reader' : 'reader-outline'}
                  />
                }
                color="coolGray.600"
                size="sm"
              />
              <Text color="coolGray.600" fontSize="12">
                Recipes
              </Text>
            </Center>
          </Pressable>
        </HStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default TestComponent;
