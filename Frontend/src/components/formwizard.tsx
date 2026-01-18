"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormSchema } from "@/lib/validations/formulario";
import StepIndicator from "./StepIndicator";
import PersonalInfoStep from "./PersonalInfoStep";
import ContactInfoStep from "./ContactInfoStep";
import FamilyInfoStep from "./FamilyInfoStep";
import DocumentsStep from "./DocumentsStep";
import NavigationButtons from "./NavigationButtons";
import { GraduationCap, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import PopupManager from "./PopupManager";

const steps = [
  { id: 1, title: "Datos Personales", description: "Información básica del aspirante" },
  { id: 2, title: "Contacto", description: "Ubicación y medios de comunicación" },
  { id: 3, title: "Familiar", description: "Información de acudientes (Opcional)" },
  { id: 4, title: "Documentos", description: "Carga de archivos requeridos" },
];

export default function FormWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const validateStep = async () => {
    let fields: (keyof FormSchema)[] = [];
    switch (currentStep) {
      case 1:
        fields = [
          "nombre", "apellido", "segundoApellido", "tipoDocumento", 
          "numeroDocumento", "lugarExpedicion", "fechaExpedicion", 
          "fechaNacimiento", "departamentoNacimiento", "ciudadNacimiento", 
          "estadoCivil", "tipoSangre", "eps", "carreraTecnicaDeseada"
        ];
        break;
      case 2:
        fields = ["telefono", "email", "municipioResidencia", "direccion"];
        break;
      case 3:
        fields = ["nombrePadre", "cedulaPadre", "nombreMadre", "cedulaMadre"];
        break;
      case 4:
        fields = ["docIdentidad", "foto", "certificado", "rut"];
        break;
    }

    const result = await trigger(fields, { shouldFocus: true });
    if (result && !completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

const onSubmit: SubmitHandler<FormSchema> = async (data) => {
  try {
    const formData = new FormData();
    
    // Recorremos los datos
    Object.entries(data).forEach(([key, value]) => {
      // 1. Ignoramos nulos o indefinidos inmediatamente
      if (value === null || value === undefined) return;

      // 2. Si es un objeto, manejamos los archivos
      if (typeof value === "object") {
        // Usamos una variable auxiliar tipo 'any' para evitar el error ts(2358)
        const fileValue = value as any; 

        if (fileValue instanceof FileList) {
          if (fileValue[0]) formData.append(key, fileValue[0]);
        } else if (fileValue instanceof File) {
          formData.append(key, fileValue);
        }
      } 
      // 3. Si es un valor primitivo (string, number, etc.)
      else {
        formData.append(key, String(value));
      }
    });
    const apiUrl = process.env.NEXT_PUBLIC_TEST_MODE === "true"
      ? process.env.NEXT_PUBLIC_API_URL_LOCAL
      : process.env.NEXT_PUBLIC_API_URL;

    // Envío de datos al servidor de Hostinger
    const res = await fetch(apiUrl!, {
      method: "POST",
      body: formData,
    });

    // Intentamos parsear la respuesta
    const text = await res.text();
    let result;
    try {
        result = JSON.parse(text);
    } catch (e) {
        throw new Error("El servidor no devolvió un JSON válido");
    }

    if (res.ok && result.status === "success") {
      setIsSuccess(true);
      reset();
    } else {
      throw new Error(result.message || "Error en el servidor");
    }
  } catch (error) {
    console.error("Submission error:", error);
    alert("Error al enviar: " + (error instanceof Error ? error.message : "Error desconocido"));
  }
};

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-slate-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">¡REGISTRO EXITOSO!</h2>
          <p className="text-slate-600 mb-8 font-medium">Tu información y documentos han sido enviados correctamente a la secretaría del Politécnico Compuoriente.</p>
          <button 
            onClick={() => { setIsSuccess(false); setCurrentStep(1); setCompletedSteps([]); }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all"
          >
            Realizar otra inscripción
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    const props = { register, errors, getValues, control: control as any };    
    switch (currentStep) {
      case 1: return <PersonalInfoStep {...props} />;
      case 2: return <ContactInfoStep {...props} />;
      case 3: return <FamilyInfoStep {...props} />;
      case 4: return <DocumentsStep {...props} />;
      default: return null;
    }
  };

  return (
    <PopupManager>
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Institucional */}
          <header className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">Politécnico Compuoriente</h1>
                <p className="text-slate-500 font-medium text-sm">Proceso de Inscripción • Sede Marinilla</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
              <StepIndicator steps={steps} currentStep={currentStep} completedSteps={completedSteps} />
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Tu Progreso</h3>
                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute h-full bg-blue-600 transition-all duration-700" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
                </div>
              </div>
            </aside>

            <main className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10">
                  <div className="min-h-[400px]">
                    {renderStep()}
                  </div>

                  {Object.keys(errors).length > 0 && (
                    <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-800 font-bold">Por favor corrige los campos marcados en rojo.</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 pt-8 border-t border-slate-100">
                    {/* El botón ahora reaccionará correctamente a isSubmitting */}
                    <NavigationButtons
                      currentStep={currentStep}
                      totalSteps={steps.length}
                      onPrev={handlePrev}
                      onNext={handleNext}
                      isSubmitting={isSubmitting}
                      isValid={true}
                    />
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PopupManager>
  );
}