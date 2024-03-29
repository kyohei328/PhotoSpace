import './App.css'
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Header } from './components/Header';
import { css } from '@emotion/react'
import  Router from './router/Router'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App(): JSX.Element {

  const Styles = ({
    heightstyle: css ({
      // height: '100vh',
      // height: '100%',
    })
  })

  return (
    <HelmetProvider>
      <MantineProvider>
        <I18nextProvider i18n={i18n}>
        <ToastContainer 
          closeOnClick
          theme="light"
          position="top-center"
          hideProgressBar
        />
          <Header/>
          <Router/>
        </I18nextProvider>
      </MantineProvider>
    </HelmetProvider>
  )
}

export default App


