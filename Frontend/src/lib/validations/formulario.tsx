import { z } from "zod";

// --- HELPERS DE VALIDACIÓN ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

// Validación de archivos obligatorios
const fileRequired = z
  .custom<FileList>((val) => val instanceof FileList, "Archivo requerido")
  .refine((files) => files && files.length > 0, {
    message: "Este archivo es obligatorio"
  })
  .refine((files) => !files?.[0] || files[0].size <= MAX_FILE_SIZE, {
    message: "El archivo no debe superar los 5MB"
  });

// Validación de archivos opcionales
const fileOptional = z
  .custom<FileList>()
  .optional()
  .refine(
    (val) => !val || val.length === 0 || (val[0] && val[0].size <= 10 * 1024 * 1024),
    { message: "El archivo no debe superar los 10MB" }
  );

export const formSchema = z.object({
  /* =============================
      INFORMACIÓN PERSONAL
  ============================== */
  nombre: z.string().min(1, "Nombre es obligatorio"),
  apellido: z.string().min(1, "Primer apellido es obligatorio"),
  segundoApellido: z.string().min(1, "Segundo apellido es obligatorio"),
  tipoDocumento: z.string().min(1, "Seleccione tipo de documento"),
  numeroDocumento: z.string()
    .min(5, "Número de documento demasiado corto")
    .regex(/^\d+$/, "Solo se permiten números"),

  lugarExpedicion: z.string().min(1, "Lugar de expedición obligatorio"),
  fechaExpedicion: z.string().min(1, "Fecha de expedición obligatoria"),
  fechaNacimiento: z.string()
    .min(1, "Fecha de nacimiento obligatoria")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, "La fecha de nacimiento debe ser en el pasado"),

  departamentoNacimiento: z.string().min(1, "Departamento obligatorio"),
  ciudadNacimiento: z.string().min(1, "Ciudad obligatoria"),

  estadoCivil: z.string().min(1, "Estado civil obligatorio"),
  tipoSangre: z.string().min(1, "Tipo de sangre obligatorio"),
  eps: z.string().min(1, "EPS obligatoria"),

carreraTecnicaDeseada: z.enum([
    "Técnico en sistemas",
    "Técnico en auxiliar clínica veterinaria",
    "Técnico asistente administrativo",
    "Técnico Auxiliar Contable y Financiero",
    "Técnico en Criminalística e Investigación Judicial",
    "Técnico en Agente de Tránsito",
    "Técnico en talento humano",
    "Técnico en Diseño Gráfico"
  ], {
    message: "Seleccione una carrera técnica válida",
  }),

  /* =============================
      CONTACTO
  ============================== */
  telefono: z.string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  email: z.string()
    .email("Formato de correo electrónico inválido")
    .toLowerCase()
    .trim(),
  municipioResidencia: z.string().min(1, "Municipio obligatorio"),
  direccion: z.string().min(1, "Dirección obligatoria"),

  /* =============================
      INFORMACIÓN FAMILIAR (OPCIONAL)
  ============================== */
  nombrePadre: z.string().optional().or(z.literal("")),
  cedulaPadre: z.string().optional().or(z.literal("")),
  nombreMadre: z.string().optional().or(z.literal("")),
  cedulaMadre: z.string().optional().or(z.literal("")),

  /* =============================
      DOCUMENTOS - PROTEGIDOS CONTRA UNDEFINED
  ============================== */
  docIdentidad: fileRequired.refine(
    (files) => !files?.[0] || ACCEPTED_DOC_TYPES.includes(files[0].type),
    { message: "Formato inválido (solo PDF, JPEG, PNG)" }
  ),
  
  foto: fileRequired.refine(
    (files) => !files?.[0] || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
    { message: "Formato de imagen inválido (solo JPEG, PNG)" }
  ),
  
  certificado: fileRequired.refine(
    (files) => !files?.[0] || ACCEPTED_DOC_TYPES.includes(files[0].type),
    { message: "Formato inválido (solo PDF, JPEG, PNG)" }
  ),
  
  rut: fileOptional.refine(
    (files) => !files || files.length === 0 || files[0]?.type === 'application/pdf',
    { message: "El RUT debe ser en formato PDF" }
  ),
});

export type FormSchema = z.infer<typeof formSchema>;