import { Component } from 'react';
export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <section className="panel" role="alert"><h2>No se pudo mostrar este módulo</h2><p>Sus registros no se han modificado. Intente recargar la página.</p><button className="primary-button" onClick={() => window.location.reload()}>Recargar</button></section> : this.props.children;
  }
}
