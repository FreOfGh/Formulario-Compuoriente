import { Users, User, FileDigit } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormSchema } from "@/lib/validations/formulario";
import InputField from "./InputField";

interface FamilyInfoStepProps {
  register: UseFormRegister<FormSchema>;
  errors: FieldErrors<FormSchema>;
  getValues: any;
}

export default function FamilyInfoStep({
  register,
  errors,
}: FamilyInfoStepProps) {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
        <div className="bg-purple-100 p-3 rounded-lg">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Información Familiar
          </h2>
          <p className="text-gray-600">
            Datos de padres o acudientes (Opcional)
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Información del Padre */}
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">Información del Padre</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Nombre Completo"
              name="nombrePadre"
              register={register}
              error={errors.nombrePadre}
              placeholder="Nombre del padre"
            />
            <InputField
              label="Número de Cédula"
              name="cedulaPadre"
              register={register}
              error={errors.cedulaPadre}
              icon={FileDigit}
              placeholder="Cédula del padre"
            />
          </div>
        </div>

        {/* Información de la Madre */}
        <div className="bg-pink-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-pink-600" />
            <h3 className="font-bold text-gray-800">Información de la Madre</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Nombre Completo"
              name="nombreMadre"
              register={register}
              error={errors.nombreMadre}
              placeholder="Nombre de la madre"
            />
            <InputField
              label="Número de Cédula"
              name="cedulaMadre"
              register={register}
              error={errors.cedulaMadre}
              icon={FileDigit}
              placeholder="Cédula de la madre"
            />
          </div>
        </div>

        {/* Nota Informativa */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <div className="text-gray-500 mt-0.5">💡</div>
            <p>
              Esta información es opcional. Solo complete si el aspirante es menor de edad 
              o si desea registrar datos de contacto adicionales para emergencias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}