import { AppProps } from 'next/app';
import { IconContext } from 'react-icons';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IconContext.Provider value={{ color: 'FFD700', size: '50px' }}>
      <QueryClientProvider client={new QueryClient()}>
        <Component {...pageProps} />
        <Toaster
          position='top-center'
          richColors
          closeButton
          expand={true}
          duration={3000}
          theme='light'
          toastOptions={{
            style: {
              zIndex: 9999,
              fontFamily: 'inherit',
            },
            className: 'text-sm',
          }}
        />
      </QueryClientProvider>
    </IconContext.Provider>
  );
}

export default MyApp;
