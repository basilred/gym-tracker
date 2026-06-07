import { Component, type ReactNode } from 'react';
import { cn } from '@bem-react/classname';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
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

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    const boundary = cn('ErrorBoundary');

    if (this.state.hasError) {
      return (
        <div className={boundary()}>
          <p className={boundary('Message')}>Что-то пошло не так</p>
          <button className={boundary('RetryBtn')} onClick={this.handleRetry}>Попробовать снова</button>
        </div>
      );
    }

    return this.props.children;
  }
}
