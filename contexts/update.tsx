async function fetchUpdateAsync () {
    try {
      if (Updates.channel === "production" || Updates.channel === "preview") {
        const update = await Updates.checkForUpdateAsync();
        if (update?.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      }
    } catch (error) {
      
    }
  };