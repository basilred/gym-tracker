import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@/pages/home/ui/Home.css';
import '@/pages/subscription-page/ui/SubscriptionPage.css';
import '@/widgets/subscription-list/ui/SubscriptionList.css';
import '@/features/create-subscription/ui/NewSubscriptionForm.css';
import '@/widgets/subscription-card/ui/SubscriptionCard.css';
import '@/widgets/subscription-detail/ui/SubscriptionDetail.css';
import '@/features/mark-visit/ui/MarkVisitButton.css';
import '@/widgets/visit-timeline/ui/VisitTimeline.css';
import '@/widgets/visit-timeline/ui/SwipeableVisit.css';
import '@/shared/ui/ErrorBoundary/ErrorBoundary.css';
import '@/shared/ui/InlineEdit/InlineEdit.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
