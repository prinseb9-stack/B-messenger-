import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./screens/Splash";
import Auth from "./screens/Auth";
import OTP from "./screens/OTP";
import Home from "./screens/Home";
import Chat from "./screens/Chat";
import Profile from "./screens/Profile";
import Calls from "./screens/Calls";
import Groups from "./screens/Groups";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/home" element={<Home />} />
         <Route path="/chat" element={<Chat />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/calls" element={<Calls />} />
          <Route path="/groups" element={<Groups />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;