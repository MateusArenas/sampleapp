const [initialLoading, setInitialLoading] = React.useState<boolean>(false);

const bootstrapAsync = async () => {
    setInitialLoading(true);
    try {
      // em primeiro lugar tem que verificar se tem um update a fazer
      await fetchUpdateAsync();

      const accessToken = await SecureStore.getItemAsync('accessToken');

      if (!accessToken) throw new Error("Access Token not provided in secure store");

      api.defaults.headers.common.Authorization = accessToken;

      const authenticateData = await apiHandler.authenticate();

      if (!authenticateData) throw new Error("Response is empty");

      if (!authenticateData.success) {
        // deu errado 
      }

      const recoverUserData = await apiHandler.recoverUser();

      if (!recoverUserData) throw new Error("Response is empty");

      if (!recoverUserData.user) {
        // deu errado 
      }

      setAccessToken(accessToken);

      await SecureStore.setItemAsync('user', JSON.stringify(recoverUserData.user));
      setUser(recoverUserData.user);

      setSigned(true);
    } catch (err) {
      // Restoring token failed
      console.log(err);
    } finally {
      setInitialLoading(false);
    }
  };