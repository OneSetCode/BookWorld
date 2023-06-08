import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Homepage } from './layouts/Homepage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth,toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewLIstPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';
import { PaymentPage } from './layouts/PaymentPage/PaymentPage';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  // switch only allows rendering one page in one route segment
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
      <Navbar />
      <div className='flex-grow-1'>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/home' />
          </Route>
          <Route path='/home'>
            <Homepage />
          </Route>
          <Route path='/search/:searchValue?'>
            <SearchBooksPage />
          </Route>
          <Route path='/reviewlist/:bookId'>
            <ReviewLIstPage/>
          </Route>
          <Route path='/checkout/:bookId'>
            <BookCheckoutPage />
          </Route>
          <Route path='/login' render={
            () => <LoginWidget config={oktaConfig}/>
            }
          />
          <Route path='login/callback' component={LoginCallback}/>
          <SecureRoute path='/shelf'> <ShelfPage/> </SecureRoute>
          <SecureRoute path='/messages'> <MessagesPage/> </SecureRoute>
          <SecureRoute path='/admin'> <ManageLibraryPage/> </SecureRoute>
          <SecureRoute path='/fees'> <PaymentPage/> </SecureRoute>
        </Switch>
      </div>
      <Footer />
      </Security>
    </div>
  );
}