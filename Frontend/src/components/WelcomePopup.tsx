"use client";

import { useState, useEffect } from "react";
import { GraduationCap, X, AlertCircle, CheckCircle, CreditCard, FileText, UserCheck, ChevronRight } from "lucide-react";

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void; // Añadido para que coincida con tu PopupManager
}

export default function WelcomePopup({ isOpen, onClose, onStart }: WelcomePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Overlay con backdrop blur */}
      <div 
        className={`absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      
      {/* Contenedor Principal con límite de altura para evitar recortes */}
      <div className={`relative w-full max-w-4xl max-h-[95vh] flex flex-col transform transition-all duration-500 ease-out ${
        isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10"
      }`}>
        
        {/* Tarjeta principal con Flex-Col */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] overflow-hidden flex flex-col">
          
          {/* Encabezado - Estático (No se mueve al hacer scroll) */}
          <div className="relative p-6 bg-gradient-to-b from-blue-500/10 to-transparent border-b border-white/5 flex-shrink-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-2xl">
                  <GraduationCap className="w-10 h-10 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Politéncico Compuoriente Marinilla
                  </h1>
                  <p className="text-blue-300/60 font-medium">Inscripción Académica</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:static text-white/30 hover:text-white p-2 hover:bg-white/5 rounded-xl transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* CUERPO CON SCROLLBAR PERSONALIZADO */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-blue-500/20
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/40
            [scrollbar-width:thin] 
            [scrollbar-color:theme(colors.blue.500/20%)_transparent]">
            
            {/* Mensaje Bienvenida */}
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center sm:text-left">
                ¡Bienvenido al proceso! 👋
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-center sm:text-left">
               Nos alegra de que desees formar parte de nuestra institución, el Politécnico Compuoriente – Marinilla. Te invitamos a leer atentamente las siguientes indicaciones para completar de manera exitosa tu proceso de inscripción. Como requisito, debes estar matriculado actualmente en el grado noveno o haber obtenido el título de bachiller.
              </p>
            </div>

            {/* Grid de Indicaciones - Todo de una vez */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl">
                <div className="flex gap-4">
                  <FileText className="w-6 h-6 text-blue-400 shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-1 text-sm">Documentación</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Diligencia el formulario de inscripción con la mayor cantidad de información posible, verificando que todos los datos sean correctos y deberás anexar una fotocopia de acta de grado o certificado de estudio, documento de identidad y foto tipo documento con fondo blanco.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-1 text-sm">Campos Requeridos</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">                      Los campos marcados con <span className="text-red-300">(*)</span> son 
                      de carácter obligatorio y deben ser diligenciados para continuar 
                      con el proceso.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl">
                <div className="flex gap-4">
                  <CreditCard className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-1 text-sm">Pago con Wompi</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">                      Una vez complete el formulario, haga clic en "Pagar" para ser 
                      redirigido a la pasarela de pagos Wompi y realizar el pago 
                      correspondiente.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl">
                <div className="flex gap-4">
                  <UserCheck className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <h3 className="text-white font-bold mb-1 text-sm">Contacto Directo</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">Después del pago verificado, nuestro equipo se pondrá en contacto con usted al celular o correo electrico del formulario de inscripcion para continuar con la matricula.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pasos Visuales */}
            <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10 mb-8">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest opacity-70">
                Línea de Proceso
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { n: "1", t: "Formulario" },
                  { n: "2", t: "Revisión" },
                  { n: "3", t: "Pago" },
                  { n: "4", t: "Inscripción" }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 ${i === 0 ? "bg-blue-500 text-white" : "bg-white/10 text-white/40"}`}>
                      {step.n}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{step.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advertencias Finales */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-amber-300/80 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Tiempo estimado: 15-20 minutos.</span>
              </div>
              <div className="flex items-center gap-3 text-blue-300/80 bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Usa una conexión a internet estable.</span>
              </div>
            </div>
          </div>

          {/* Pie del popup - Estático */}
          <div className="bg-slate-950/50 p-6 border-t border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-slate-500 text-xs mb-1">Dudas en el proceso:</p>
                <p className="text-white font-bold text-base sm:text-lg">(604) 123-4567</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-3 text-slate-400 hover:text-white text-sm font-bold transition"
                >
                  Más tarde
                </button>
                <button
                  onClick={() => { onStart(); onClose(); }}
                  className="flex-[2] sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)]"
                >
                  LISTO, EMPEZAR
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}