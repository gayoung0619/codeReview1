import { RecoilRoot } from "recoil";
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider, Helmet } from "react-helmet-async";
import App from './App.tsx'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
      <HelmetProvider>
        <Helmet>
          <title>k-하이테크 관리자</title>
          <meta name="description" content="Description of my page" />
          <link rel="icon" href="/favicon.svg" />
        </Helmet>
      </HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </RecoilRoot>,
)
