import { Phone, Mail, MapPin, Home } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormSchema } from "@/lib/validations/formulario";
import InputField from "./InputField";

interface ContactInfoStepProps {
  register: UseFormRegister<FormSchema>;
  errors: FieldErrors<FormSchema>;
  getValues: any;
}

export default function ContactInfoStep({
  register,
  errors,
}: ContactInfoStepProps) {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
        <div className="bg-green-100 p-3 rounded-lg">
          <Phone className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Información de Contacto
          </h2>
          <p className="text-gray-600">
            Datos para comunicación y ubicación
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Teléfono Celular *"
          name="telefono"
          register={register}
          error={errors.telefono}
          icon={Phone}
          placeholder="Ej: 3001234567"
        />

        <InputField
          label="Correo Electrónico *"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          icon={Mail}
          placeholder="ejemplo@correo.com"
        />

        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Ubicación de Residencia
          </h3>
        </div>

        <InputField
          label="Municipio *"
          name="municipioResidencia"
          register={register}
          error={errors.municipioResidencia}
          icon={MapPin}
          placeholder="Municipio donde reside"
        />

        <InputField
          label="Dirección *"
          name="direccion"
          register={register}
          error={errors.direccion}
          icon={Home}
          placeholder="Dirección completa"
        />

        <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500">ℹ️</div>
            <div>
              <h4 className="font-medium text-blue-800">Importante</h4>
              <p className="text-sm text-blue-600 mt-1">
                La información de contacto será utilizada para enviar notificaciones 
                sobre el proceso de admisión al Politécnico ComputOriente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}