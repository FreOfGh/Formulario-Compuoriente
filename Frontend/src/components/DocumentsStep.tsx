"use client";

import { FileText, Upload, FileCheck, AlertCircle } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormSchema } from "@/lib/validations/formulario";
import { useState } from "react";

interface DocumentsStepProps {
  register: UseFormRegister<FormSchema>;
  errors: FieldErrors<FormSchema>;
}

export default function DocumentsStep({ register, errors }: DocumentsStepProps) {
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const documentTypes = [
    {
      name: "docIdentidad",
      label: "Fotocopia del Documento de Identidad",
      description: "Documento de identificación vigente (PDF o imagen)",
      required: true,
      formats: ".pdf,.jpg,.jpeg,.png",
      displayFormats: "PDF, JPG, PNG (Máx. 5MB)",
    },
    {
      name: "foto",
      label: "Fotografía fondo blanco",
      description: "Fotografía tipo carnet (JPEG o PNG)",
      required: true,
      formats: ".jpg,.jpeg,.png",
      displayFormats: "JPG, PNG (Máx. 2MB)",
    },
    {
      name: "certificado",
      label: "Diploma o Acta de Grado",
      description: "Certificado de estudios finalizados (PDF o imagen)",
      required: true,
      formats: ".pdf,.jpg,.jpeg,.png",
      displayFormats: "PDF, JPG, PNG (Máx. 10MB)",
    },
    {
      name: "rut",
      label: "RUT (Opcional)",
      description: "Registro Único Tributario si cuenta con él (PDF)",
      required: false,
      formats: ".pdf",
      displayFormats: "PDF (Máx. 10MB)",
    },
  ];

  const handleFileChange = (name: string, fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: fileList[0]
      }));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Encabezado de Alto Contraste */}
      <div className="flex items-center space-x-4 mb-8 pb-6 border-b-2 border-slate-100">
        <div className="bg-blue-600 p-3.5 rounded-2xl shadow-lg shadow-blue-200">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Carga de Documentos</h2>
          <p className="text-slate-500 font-bold text-sm">Asegúrese de que los archivos sean legibles</p>
        </div>
      </div>

      <div className="space-y-5">
        {documentTypes.map((doc) => {
          const selectedFile = files[doc.name];
          const hasError = !!errors[doc.name as keyof FormSchema];
          const fileError = errors[doc.name as keyof FormSchema]?.message as string;

          return (
            <div 
              key={doc.name} 
              className={`group bg-white border-2 rounded-2xl p-5 transition-all duration-300 ${
                hasError 
                  ? 'border-red-500 bg-red-50/30' 
                  : selectedFile 
                    ? 'border-emerald-500 bg-emerald-50/20' 
                    : 'border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{doc.label}</h3>
                    {doc.required && (
                      <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-md tracking-widest uppercase">
                        Obligatorio
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 font-semibold text-xs mt-0.5">{doc.description}</p>
                </div>
                {selectedFile ? (
                  <div className="bg-emerald-500 p-1.5 rounded-full">
                    <FileCheck className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className={`p-1.5 rounded-full ${hasError ? 'bg-red-100' : 'bg-slate-100'}`}>
                    <Upload className={`w-5 h-5 ${hasError ? 'text-red-600' : 'text-slate-400'}`} />
                  </div>
                )}
              </div>

              <div className="relative">
                <label 
                  htmlFor={`file-${doc.name}`}
                  className={`flex flex-col items-center justify-center w-full min-h-[110px] border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    selectedFile 
                      ? 'border-emerald-400 bg-white shadow-inner' 
                      : hasError 
                        ? 'border-red-300 bg-white' 
                        : 'border-slate-300 bg-slate-50 hover:bg-white group-hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center py-4 px-4 text-center">
                    {selectedFile ? (
                      <div className="animate-in zoom-in-95 duration-300">
                        <p className="text-sm font-black text-emerald-900 truncate max-w-[300px] bg-emerald-100 px-3 py-1 rounded-lg">
                          📄 {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase tracking-widest">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-slate-600 font-bold">
                          <span className="text-blue-600 underline decoration-2 underline-offset-4">
                            Seleccione el archivo
                          </span> o arrástrelo aquí
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2 font-black uppercase tracking-tighter">
                          {doc.displayFormats}
                        </p>
                      </>
                    )}
                  </div>
                </label>

                {/* Input de archivo oculto */}
                <input
                  id={`file-${doc.name}`}
                  type="file"
                  accept={doc.formats}
                  className="hidden"
                  {...register(doc.name as keyof FormSchema, {
                    onChange: (e) => {
                      handleFileChange(doc.name, e.target.files);
                    }
                  })}
                />

                {hasError && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">
                      {fileError}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Info Box mejorada */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl shadow-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-1.5 rounded-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-black uppercase tracking-tighter">Instrucciones de Finalización</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <span className="text-blue-400 font-bold">01.</span>
              <p className="text-[11px] font-medium text-slate-300">
                Los documentos deben ser originales escaneados, no fotos borrosas.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <span className="text-blue-400 font-bold">02.</span>
              <p className="text-[11px] font-medium text-slate-300">
                Si un documento tiene varias páginas, únalas en un solo PDF.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}