import { GrispiProvider } from "./contexts/grispi-context";
import { StoreProvider } from "./contexts/store-context";
import { HomeScreen } from "./screens/home-screen";

const App = () => {
  return (
    <StoreProvider>
      <GrispiProvider>
        <HomeScreen />
      </GrispiProvider>
    </StoreProvider>
  );
};

export default App;
