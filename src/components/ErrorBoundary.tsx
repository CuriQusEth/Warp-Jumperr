import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // If it's a known extension property conflict, ignore it
    if (
      error.message &&
      (error.message.includes('Cannot redefine property') ||
        error.message.includes('isZerion'))
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Suppress extension errors
    if (
      error.message &&
      (error.message.includes('Cannot redefine property') ||
        error.message.includes('isZerion'))
    ) {
      return;
    }
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center mb-4 border border-red-500/40">
            ⚠️
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-white/60 text-sm max-w-md mb-6 font-mono">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm rounded-lg transition-colors"
          >
            Reload Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
