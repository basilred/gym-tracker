import { cn } from '@bem-react/classname';
import { Component, createRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  private retryBtnRef = createRef<HTMLButtonElement>();

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('Error caught by boundary:', error.message);
  }

  componentDidUpdate(_prevProps: Props, prevState: State): void {
    if (prevState.hasError && !this.state.hasError) {
      const h1 = document.querySelector('h1');
      h1?.focus({ preventScroll: true });
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    const boundary = cn('ErrorBoundary');

    if (this.state.hasError) {
      return (
        <div className={boundary()}>
          <p className={boundary('Message')}>Что-то пошло не так</p>
          <button ref={this.retryBtnRef} className={boundary('RetryBtn')} onClick={this.handleRetry}>Попробовать снова</button>
        </div>
      );
    }

    return this.props.children;
  }
}
