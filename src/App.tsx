import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";

//#region Pages
import Chat from "./pages/chat";
import Login from "./pages/user";
//#endregion

export default function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/user" element={<Login />} />
      </Routes>
    </Router>
  )
}

function Home(){
  return(
    <Layout>
      <h1>Welcome!</h1>
    </Layout>
  )
}
