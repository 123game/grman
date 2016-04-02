# moup - Mobile user profile Redis storage
Nodejs module that can get/set the profile of mobile user identified by device id and Facebook id

## Install

    npm install moup

## Usage

```js
var moup = require("moup")();

...

moup.getProfile(device_id, facebook_id, function(err, profile) {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.stringify(profile));
  }
});

...

moup.setProfile(device_id, facebook_id, profile, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Success");
  }
});

```
