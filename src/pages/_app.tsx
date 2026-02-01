import { ConfigProvider } from 'antd';
import { AppProps } from 'next/app';
import { IconContext } from 'react-icons';
import { QueryClient, QueryClientProvider } from 'react-query';

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
      <ConfigProvider
        theme={{
          token: {
            // golden antique colors
            colorBgLayout: '#f5f5dc',
          },
          components: {
            Table: {
              borderColor: '#f5f5dc',
              headerBg: '#f5f5dc',
            },
          },
        }}
      >
        <QueryClientProvider client={new QueryClient()}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </ConfigProvider>
    </IconContext.Provider>
  );
}

export default MyApp;
