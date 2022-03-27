# Fridge-It: A Fridge Tracking App

![fridge1](https://user-images.githubusercontent.com/72388056/153027723-4a30b8a1-819a-4f62-912e-96c94e4d2a01.jpg)
![fridge2](https://user-images.githubusercontent.com/72388056/153027766-31a048e7-2fe9-4965-8063-d5edbd8428aa.jpg)
![fridge3](https://user-images.githubusercontent.com/72388056/153027779-7d367779-5ae9-48bf-8e67-9bae583463ad.jpg)

For our final group project at Northcoders we created an app that can track the contents of your fridge and give you notifications when food is going out of date. There are three ways to input food:

- Manually.
- By taking a picture of it and image recognition will determine what it is.
- By scanning a barcode on the food item.

There is a traffic light system to determine what is out of date (i.e. red is out-of-date, amber means 'going out-of-date today and green means still fresh'). You are also able to change the quantity and delete food from your fridge list as well as filter your fridge by category.

### Click below to view our presentation for the app
[![Click here to view our presentation](http://img.youtube.com/vi/0K0Ok5AHvO8/0.jpg)](http://www.youtube.com/watch?v=0K0Ok5AHvO8)

## Setup

It might be quite complicated at the moment to view this app as it is currently not hosted. You would require a firestore database from [Firebase](https://firebase.google.com/) and a clarifai api key to their [food identifcation AI model](https://www.clarifai.com/models/ai-food-recognition) as well as the [Expo app](https://expo.dev/) installed on your phone.

- Clone the repository with this link: https://github.com/jamesgrannan/fridge-tracking-app.git
- Make sure you change directory into this repository.
- Running this in your terminal should install all the necessary packages:

```json
  npm install
```

- You wil need to create an .env file whith your own api keys. The contents being:
  FIREBASE_API_KEY={insert your Firebase API key here}
```

- To view the app, you will need to run:

```json
  npm run start
```

This will show you a QR code. Open the Expo app and scan the QR code. The app should eventually load, but with an empty fridge. Get adding!
