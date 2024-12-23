import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./ui/AppLayout";
import Account from "./pages/Account";
import Exercises from "./pages/Exercises";
import PageNotFound from "./pages/PageNotFound";
import Weight from "./pages/Weight";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import { Toaster } from "./components/ui/toaster";
import { SidebarProvider } from "./components/ui/sidebar";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          {/* <ToastProvider duration={3000}> */}
          <SidebarProvider className="bg-gray-200">
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <ReactQueryDevtools initialIsOpen={false} />
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route
                      index
                      element={<Navigate replace to="dashboard" />}
                    />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="account" element={<Account />} />
                    <Route path="exercises" element={<Exercises />} />
                    <Route path="weight" element={<Weight />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </QueryClientProvider>
          </SidebarProvider>
          {/* </ToastProvider> */}
        </SignedIn>
      </ClerkProvider>
    </>
  );
}

export default App;
