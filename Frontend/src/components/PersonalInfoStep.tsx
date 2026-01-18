import { 
  User, FileDigit, MapPin, Calendar, Heart, 
  Home, CreditCard, Users, GraduationCap 
} from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormSchema } from "@/lib/validations/formulario";
import InputField from "./InputField";

interface PersonalInfoStepProps {
  register: UseFormRegister<FormSchema>;
  errors: FieldErrors<FormSchema>;
}

export default function PersonalInfoStep({
  register,
  errors,
}: PersonalInfoStepProps) {
  
  const estadosCiviles = ["Soltero/a", "Casado/a", "Unión libre", "Divorciado/a", "Viudo/a"];
  
  const tiposDoc = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "TI", label: "Tarjeta de Identidad" },
    { value: "CE", label: "Cédula de Extranjería" },
    { value: "PEP", label: "PEP / PPT" },
  ];

  const carrerasTecnicas = [
    "Técnico en sistemas",
    "Técnico en auxiliar clínica veterinaria",
    "Técnico asistente administrativo",
    "Técnico Auxiliar Contable y Financiero",
    "Técnico en Criminalística e Investigación Judicial",
    "Técnico en Agente de Tránsito",
    "Técnico en talento humano",
    "Técnico en Diseño Gráfico"
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
        <div className="bg-blue-100 p-3 rounded-lg">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Información del Aspirante
          </h2>
          <p className="text-gray-600 text-sm">
            Complete los datos de interés académico y de identidad
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Selección de Carrera Técnica */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
            Carrera Técnica Deseada *
          </label>
          <select
            {...register("carreraTecnicaDeseada")}
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center] ${
              errors.carreraTecnicaDeseada 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'
            } focus:ring-4`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.5em' }}
          >
            <option value="">Seleccione el programa de su interés...</option>
            {carrerasTecnicas.map(carrera => (
              <option key={carrera} value={carrera}>{carrera}</option>
            ))}
          </select>
          {errors.carreraTecnicaDeseada && (
            <p className="text-red-600 text-xs mt-1 font-medium italic">
              {errors.carreraTecnicaDeseada.message}
            </p>
          )}
        </div>

        {/* Nombres y Apellidos */}
        <InputField
          label="Nombre completo"
          name="nombre"
          register={register}
          error={errors.nombre}
          icon={User}
          placeholder="Ej: Juan José"
        />
        
        <InputField
          label="Primer Apellido *"
          name="apellido"
          register={register}
          error={errors.apellido}
          icon={User}
          placeholder="Ej: Pérez"
        />

        <InputField
          label="Segundo Apellido *"
          name="segundoApellido"
          register={register}
          error={errors.segundoApellido}
          icon={User}
          placeholder="Ej: Gómez"
        />

        {/* Selección de Tipo de Documento */}
        <div className="md:col-span-2 space-y-3">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
            Tipo de Documento *
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {tiposDoc.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all hover:border-blue-300 ${
                  errors.tipoDocumento ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register("tipoDocumento")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.tipoDocumento && (
            <p className="text-red-600 text-xs mt-1 font-medium italic">
              {errors.tipoDocumento.message}
            </p>
          )}
        </div>

        {/* Datos del Documento */}
        <InputField
          label="Número de Documento *"
          name="numeroDocumento"
          register={register}
          error={errors.numeroDocumento}
          type="number"
          icon={FileDigit}
          placeholder="Sin puntos ni comas"
        />

        <InputField
          label="Lugar de Expedición *"
          name="lugarExpedicion"
          register={register}
          error={errors.lugarExpedicion}
          icon={MapPin}
          placeholder="Ej: Bogotá, D.C."
        />

        <InputField
          label="Fecha de Expedición *"
          name="fechaExpedicion"
          type="date"
          register={register}
          error={errors.fechaExpedicion}
          icon={Calendar}
        />

        <InputField
          label="Fecha de Nacimiento *"
          name="fechaNacimiento"
          type="date"
          register={register}
          error={errors.fechaNacimiento}
          icon={Calendar}
        />

        <InputField
          label="Departamento de Nacimiento *"
          name="departamentoNacimiento"
          register={register}
          error={errors.departamentoNacimiento}
          icon={MapPin}
          placeholder="Ej: Antioquia"
        />

        <InputField
          label="Ciudad de Nacimiento *"
          name="ciudadNacimiento"
          register={register}
          error={errors.ciudadNacimiento}
          icon={MapPin}
          placeholder="Ej: Medellín"
        />

        {/* Estado Civil */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            Estado Civil *
          </label>
          <select
            {...register("estadoCivil")}
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center] ${
              errors.estadoCivil 
                ? 'border-red-300 focus:ring-red-200' 
                : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'
            } focus:ring-4`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.5em' }}
          >
            <option value="">Seleccione una opción...</option>
            {estadosCiviles.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          {errors.estadoCivil && (
            <p className="text-red-600 text-xs mt-1 font-medium italic">
              {errors.estadoCivil.message}
            </p>
          )}
        </div>

        <InputField
          label="Tipo de Sangre *"
          name="tipoSangre"
          register={register}
          error={errors.tipoSangre}
          icon={Heart}
          placeholder="O+, A-, etc."
        />

        <div className="md:col-span-2">
          <InputField
            label="Entidad de Salud (EPS) *"
            name="eps"
            register={register}
            error={errors.eps}
            icon={Home}
            placeholder="Nombre de su entidad de salud actual"
          />
        </div>
      </div>
    </div>
  );
}