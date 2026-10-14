import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[FormClub ErrorBoundary caught an error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoDashboard = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex items-center justify-center p-6 bg-[#0A0A0C]">
          <div className="bg-[#141418] border border-[#E5A910]/30 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 bg-[#E5A910]/15 text-[#E5A910] rounded-2xl border border-[#E5A910]/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">Instabilidade Temporária Evitada</h2>
              <p className="text-xs text-gray-400 mt-2">
                O FormClub protegeu a interface contra encerramento inesperado de sessão. Seus dados continuam preservados.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 bg-black/40 border border-white/5 rounded-xl text-left">
                  <p className="text-[11px] font-mono text-red-400 break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-[#E5A910] text-[#0A0A0C] font-bold text-xs rounded-xl hover:bg-[#E5A910]/90 transition flex items-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Recarregar Página
              </button>
              <button
                onClick={this.handleGoDashboard}
                className="px-4 py-2 bg-[#141418] border border-white/10 text-white font-bold text-xs rounded-xl hover:border-[#E5A910]/40 transition flex items-center gap-2"
              >
                <Home className="h-3.5 w-3.5" /> Ir para Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
