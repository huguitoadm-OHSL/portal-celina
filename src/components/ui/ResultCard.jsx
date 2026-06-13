import React, { useState } from 'react';
import { CheckCircle2, Copy, Mail, Info } from 'lucide-react';
import { SUPERVISORES } from '../../constants/equipo';

export const ResultCard = ({ title, text, htmlContent, subject, supervisorDestino, setSupervisorDestino, showTextPlain = true, fixedDestinoLabel, fixedDestinoEmail, ccEmails, hideDestino = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      if (htmlContent) {
        const div = document.createElement('div');
        div.innerHTML = String(htmlContent);
        div.style.position = 'fixed';
        div.style.pointerEvents = 'none';
        div.style.opacity = '0';
        div.style.backgroundColor = '#ffffff';
        div.style.color = '#000000';
        document.body.appendChild(div);

        const range = document.createRange();
        range.selectNode(div);
        const windowSelection = window.getSelection();
        windowSelection.removeAllRanges();
        windowSelection.addRange(range);

        document.execCommand('copy');

        windowSelection.removeAllRanges();
        document.body.removeChild(div);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = String(text);
        textArea.style.position = "fixed";
        textArea.style.top = "-9999px";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al intentar copiar al portapapeles:', err);
    }
  };

  const handleOpenEmailApp = () => {
    handleCopy();
    const to = fixedDestinoEmail || supervisorDestino || '';
    const ccQuery = ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : '';
    const instruccionPega = "(Por favor, borra este texto, mantén presionado aquí y selecciona 'Pegar' para insertar la tabla con su formato oficial)";
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}${ccQuery}&body=${encodeURIComponent(instruccionPega)}`;
    
    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 400);
  };

  const handleOpenGmail = () => {
    handleCopy();
    const to = fixedDestinoEmail || supervisorDestino || '';
    const ccQuery = ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : '';
    const instruccionPega = "(Por favor, borra este texto, mantén presionado aquí y selecciona 'Pegar' para insertar la tabla con su formato oficial)";
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodeURIComponent(subject)}${ccQuery}&body=${encodeURIComponent(instruccionPega)}`;
    
    setTimeout(() => {
      window.open(gmailLink, '_blank');
    }, 400);
  };

  const handleOpenOutlook = () => {
    handleCopy();
    const to = fixedDestinoEmail || supervisorDestino || '';
    const ccQuery = ccEmails ? `&cc=${encodeURIComponent(ccEmails)}` : '';
    const subjectEnc = encodeURIComponent(subject);
    const bodyEnc = encodeURIComponent("(Por favor, borra este texto, mantén presionado aquí y selecciona 'Pegar' para insertar la tabla con su formato oficial)");
    
    setTimeout(() => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      if (isAndroid) {
        const intentUrl = `intent:${to}?subject=${subjectEnc}${ccQuery}&body=${bodyEnc}#Intent;scheme=mailto;package=com.microsoft.office.outlook;end;`;
        window.location.href = intentUrl;
      } else if (isIOS) {
        window.location.href = `ms-outlook://compose?to=${to}&subject=${subjectEnc}${ccQuery}&body=${bodyEnc}`;
      } else {
        window.location.href = `mailto:${to}?subject=${subjectEnc}${ccQuery}&body=${bodyEnc}`;
      }
    }, 400);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 sticky top-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col h-full max-h-[85vh] min-w-0 w-full">
      <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center tracking-tight">
        <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-2" />
        Vista Previa del Mensaje
      </h3>

      {!hideDestino && (
        <div className="mb-5 w-full">
          <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-0.5">Enviar a:</label>
          {fixedDestinoEmail ? (
            <div className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-100/70 text-slate-700 font-semibold shadow-inner truncate text-sm">
              {String(fixedDestinoLabel)} {fixedDestinoEmail ? `(${String(fixedDestinoEmail)})` : ''}
            </div>
          ) : (
            <select 
              value={supervisorDestino}
              onChange={(e) => setSupervisorDestino && setSupervisorDestino(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/50 text-slate-800 font-semibold shadow-sm cursor-pointer text-sm"
            >
              {SUPERVISORES.map(s => (
                <option key={s.id} value={s.correo}>{String(s.nombre)} ({String(s.correo)})</option>
              ))}
            </select>
          )}
          {ccEmails && (
              <p className="text-xs text-slate-500 mt-2 ml-1"><strong>CC:</strong> {String(ccEmails)}</p>
          )}
        </div>
      )}

      {htmlContent && (
        <div className="mb-4 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3 items-start shadow-sm w-full">
          <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-800 leading-relaxed">
            <strong>Si usas PC:</strong> Haz clic en <b>"Copiar Formato PC"</b> y pega directo en tu gestor de correo.<br/>
            <strong>Si usas Celular:</strong> Usa los botones inferiores para abrir la App con el diseño copiado en memoria.
          </p>
        </div>
      )}

      <div className="bg-[#f8fafc] p-5 rounded-xl border border-slate-200 mb-5 flex-1 overflow-auto shadow-inner w-full min-w-0" id="vista-previa-contenido">
        {htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: String(htmlContent) }} />
        ) : (
          <div className="font-mono text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{String(text)}</div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold transition-all shadow-sm whitespace-nowrap"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2 text-slate-400" />}
          {copied ? '¡Copiado Exitosamente!' : (htmlContent ? 'Copiar Formato PC' : 'Copiar Texto para WhatsApp')}
        </button>
        {showTextPlain && !hideDestino && (
          <div className="flex-1 flex flex-col gap-2">
            <button
              onClick={handleOpenEmailApp}
              className="w-full flex items-center justify-center py-2 px-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl font-bold transition-all shadow-md shadow-slate-900/20 whitespace-nowrap text-sm"
              title="Abrir en la aplicación de correo predeterminada del sistema"
            >
              <Mail className="w-4 h-4 mr-2" />
              App de Correo (Por defecto)
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOpenGmail}
                className="flex items-center justify-center py-2 px-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-md text-xs whitespace-nowrap"
              >
                Abrir en Gmail
              </button>
              <button
                onClick={handleOpenOutlook}
                className="flex items-center justify-center py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md text-xs whitespace-nowrap"
              >
                App Outlook
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

