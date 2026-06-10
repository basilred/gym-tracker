import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/home';
import { SubscriptionPage } from '@/pages/subscription-page';
import { useSubscriptions, SubscriptionProvider } from '@/entities/subscription';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

function Announcements() {
  const { announcement } = useSubscriptions();

  return (
    <div aria-live="polite" role="status" className="visually-hidden">
      {announcement}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/gym-tracker/'}>
      <SubscriptionProvider>
        <ErrorBoundary>
          <Announcements />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subscription/:id" element={<SubscriptionPage />} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Страница не найдена</p>
                <a href="/">← Вернуться на главную</a>
              </div>
            } />
          </Routes>
        </ErrorBoundary>
      </SubscriptionProvider>
    </BrowserRouter>
  );
}
