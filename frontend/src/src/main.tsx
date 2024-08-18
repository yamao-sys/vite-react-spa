import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './layout.tsx';
import App from './App.tsx';
import { NAVIGATION_LIST } from './constants/navigation/index.ts';
import { SignUpPage } from './pages/auth/sign_up/index.tsx';
import { SignInPage } from './pages/auth/sign_in/index.tsx';
import { NotFound } from './components/organisms/NotFound/index.tsx';
import { ReadingRecordListsPage } from './pages/reading_records/lists/index.tsx';
import { ReadingRecordCreatePage } from './pages/reading_records/new/index.tsx';
import { ReadingRecordEditPage } from './pages/reading_records/edit/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={NAVIGATION_LIST.top} element={<App />}></Route>
          <Route path={NAVIGATION_LIST.auth.signUp} element={<SignUpPage />}></Route>
          <Route path={NAVIGATION_LIST.auth.signIn} element={<SignInPage />}></Route>
          <Route
            path={NAVIGATION_LIST.readingRecords.list}
            element={<ReadingRecordListsPage />}
          ></Route>
          <Route
            path={NAVIGATION_LIST.readingRecords.new}
            element={<ReadingRecordCreatePage />}
          ></Route>
          <Route
            path={NAVIGATION_LIST.readingRecords.edit}
            element={<ReadingRecordEditPage />}
          ></Route>
          <Route path='/*' element={<NotFound />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
);
