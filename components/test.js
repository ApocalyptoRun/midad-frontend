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