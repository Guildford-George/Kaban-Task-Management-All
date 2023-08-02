import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleAuth from "./contexts/RoleAuthProvider";
import ActiveBoardProvider from "./contexts/ActiveBoardProvider";
import PublicRoute from "./contexts/PublicRoute";
import useTheme from "./hooks/ContextHooks/useTheme";
function App() {
  const {theme}= useTheme()
  return (
    <>
      <div className={theme}>
        <Routes>
          <Route
            path="/boards/:id"
            element={
              <RoleAuth>
                <ActiveBoardProvider>
                  <MainPage />
                </ActiveBoardProvider>
              </RoleAuth>
            }
          />
          <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
          } />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
