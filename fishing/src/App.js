import "./App.css";
import Stage from "./pages/Stage";
import { NotificationProvider } from "./gamesetup/Notification/NotificationContext";

const App = () => {
  return (
    <div className="App">
      <NotificationProvider>
        <Stage />
      </NotificationProvider>
    </div>
  );
};

export default App;
