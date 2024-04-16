if (isPlaying) {
    await sound.pauseAsync();
  } else {
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      await sound.playAsync();
    } else {
      console.log("Audio not yet loaded, retrying...");
      //await sound.unloadAsync();
      const { sound } = await Audio.Sound.createAsync({
        uri: item.imageUrl,
      });
      setDurationMillis(sound.durationMillis);
      setSound(sound);
      await sound.playAsync();
    }
  }
  setIsPlaying(!isPlaying);


      
      {/*    <Button
        title="Play Sound"
        onPress={playSound}
        disabled={sound !== null}
      />
      <Button
        title="Stop Sound"
        onPress={stopSound}
        disabled={sound === null}
      /> */}

      {/*   <View>
        <View>
          <IconButton
            icon={isPlaying ? "pause" : "play"}
            size={48}
            iconColor="blue"
          />
        </View>
        <View></View>
      </View> */}

      //************************************************* */

       {/* {isPlaying ? (
            <Text style={styles.buttonText}>Pause</Text>
          ) : (
            <Text style={styles.buttonText}>Play</Text>
          )} */}

//************************************************* */

           /* sound.stopAsync().then(() => {
              sound.unloadAsync();
              const { sound: newSound } = Audio.Sound.createAsync({
                uri: item.imageUrl,
              });
              //setDurationMillis(newSound.durationMillis);
              setSound(newSound);
            }); */


//********************userDetails screen***************************** */
const saveDetails = async () => {
  try {
    // const putData = {
    //   firstName: firstName,
    //   imageUrl: image,
    // };
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("file", {
      uri: image,
      name: "image.jpg",
      type: "image/jpeg",
    });

    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${userToken}`,
    //     "Content-Type": "application/json",
    //   },
    // };

    // console.log(putData);
    //console.log(userToken);

    // axios
    //   .put(`${BASE_URL}/user/update`, putData, config)
    //   .then((response) => {
    //     console.log(response.data);

    //     //navigation.navigate('HomeScreen');
    //     setIsFirstAuth(!isFirstAuth);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    console.log(formData)

    const response = await fetch(`${BASE_URL}/user/update`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response) {
      console.log(response.headers.get('Content-Type'));

      const responseData = await response.text();
      console.log(responseData);

      setIsFirstAuth(!isFirstAuth);
    }
  } catch (error) {
    console.log(`Error while updating user details ${error}`);
  }
};
