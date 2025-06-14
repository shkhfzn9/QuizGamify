import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./LoginPage.tsx";
import Register from "./RegisterPage.jsx";
import Button from "../components/ui/Button";

const AuthPage = ({ type = "login" }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {type === "login" ? <Login /> : <Register />}

        <div className="mt-6 text-center text-sm text-gray-500">
          {type === "login" ? (
            <>
              Or continue with{" "}
              <Button
                variant="secondary"
                size="sm"
                className="inline-flex items-center"
                onClick={() => console.log("Google login")}
              >
                <i className="fab fa-google mr-2"></i> Google
              </Button>
            </>
          ) : (
            <p>
              By registering, you agree to our Terms of Service and Privacy
              Policy
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
